package com.example.ChatApp.Services;

import com.example.ChatApp.Exceptions.UserNotFoundException;
import com.example.ChatApp.Models.ChatRoom;
import com.example.ChatApp.Models.DTOs.ConversationDTO;
import com.example.ChatApp.Models.DTOs.UserDTO;
import com.example.ChatApp.Models.ChatMessage;
import com.example.ChatApp.Models.Mappers.UserMapper;
import com.example.ChatApp.Models.User;
import com.example.ChatApp.Repositories.ChatMessageRepository;
import com.example.ChatApp.Repositories.ChatRoomRepository;
import com.example.ChatApp.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(userMapper::toDTO).collect(Collectors.toList());
    }

    public UserDTO getUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("id", id));
        return userMapper.toDTO(user);
    }

    /**
     * Search users by username or name (case-insensitive)
     * Excludes the current user from results
     */
    public List<UserDTO> searchUsers(String query, String currentUserId, int limit) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }

        List<User> users = userRepository.searchByUsernameOrName(query.trim());
        return users.stream()
                .filter(user -> !user.getId().equals(currentUserId))
                .limit(limit)
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all conversations for a user (users they have chatted with before)
     * Returns conversation info sorted by last message time
     */
    public List<ConversationDTO> getConversations(String userId) {
        // Get all chat rooms involving this user
        List<ChatRoom> chatRooms = chatRoomRepository.findByFirstUserIdOrSecondUserId(userId, userId);

        if (chatRooms.isEmpty()) {
            return Collections.emptyList();
        }

        List<ConversationDTO> conversations = new ArrayList<>();

        for (ChatRoom room : chatRooms) {
            // Determine the other user in the conversation
            String otherUserId = room.getFirstUserId().equals(userId)
                    ? room.getSecondUserId()
                    : room.getFirstUserId();

            // Get the other user's info
            Optional<User> otherUserOpt = userRepository.findById(otherUserId);
            if (otherUserOpt.isEmpty()) {
                continue;
            }
            User otherUser = otherUserOpt.get();

            // Get the last message in this chat room
            Optional<ChatMessage> lastMessageOpt = chatMessageRepository
                    .findFirstByChatIdOrderByTimestampDesc(room.getId());

            ConversationDTO.ConversationDTOBuilder builder = ConversationDTO.builder()
                    .odUserId(otherUser.getId())
                    .name(otherUser.getName())
                    .username(otherUser.getUsername())
                    .unreadCount(0); // Can be enhanced with read receipts later

            if (lastMessageOpt.isPresent()) {
                ChatMessage lastMessage = lastMessageOpt.get();
                builder.lastMessage(lastMessage.getContent())
                        .lastMessageTime(lastMessage.getTimestamp())
                        .lastMessageSenderId(lastMessage.getSenderId());
            }

            conversations.add(builder.build());
        }

        // Sort by last message time (most recent first)
        conversations.sort((c1, c2) -> {
            if (c1.getLastMessageTime() == null && c2.getLastMessageTime() == null)
                return 0;
            if (c1.getLastMessageTime() == null)
                return 1;
            if (c2.getLastMessageTime() == null)
                return -1;
            return c2.getLastMessageTime().compareTo(c1.getLastMessageTime());
        });

        return conversations;
    }
}
