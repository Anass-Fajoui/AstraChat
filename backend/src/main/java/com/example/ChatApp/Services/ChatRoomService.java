package com.example.ChatApp.Services;

import com.example.ChatApp.Models.ChatRoom;
import com.example.ChatApp.Repositories.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;

    public String getChatRoomId(String senderId, String receiverId){
        Optional<ChatRoom> firstSearch = chatRoomRepository.findByFirstUserIdAndSecondUserId(senderId, receiverId);
        if (firstSearch.isEmpty()) {
            Optional<ChatRoom> secondSearch = chatRoomRepository.findByFirstUserIdAndSecondUserId(receiverId, senderId);
            if (secondSearch.isEmpty()) {
                ChatRoom chatRoom = ChatRoom.builder()
                        .firstUserId(senderId)
                        .secondUserId(receiverId)
                        .build();
                return chatRoomRepository.save(chatRoom).getId();
            }
            else {
                ChatRoom chatRoom = secondSearch.get();
                return chatRoom.getId();
            }
        } else {
            ChatRoom chatRoom = firstSearch.get();
            return chatRoom.getId();
        }
    }

    public List<ChatRoom> getChatRoomByUserId(String userId) {
        return chatRoomRepository.findByFirstUserIdOrSecondUserId(userId, userId);
    }
}
