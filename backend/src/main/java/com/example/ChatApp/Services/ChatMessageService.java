package com.example.ChatApp.Services;

import com.example.ChatApp.Models.ChatMessage;
import com.example.ChatApp.Models.DTOs.ChatMessageRequest;
import com.example.ChatApp.Repositories.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomService chatRoomService;

    public ChatMessage addChatMessage(ChatMessageRequest request) {
        String chatRoomId = chatRoomService.getChatRoomId(
                request.getSenderId(),
                request.getReceiverId());
        ChatMessage chatMessage = ChatMessage.builder()
                .chatId(chatRoomId)
                .senderId(request.getSenderId())
                .receiverId(request.getReceiverId())
                .content(request.getContent())
                .timestamp(Instant.now())
                .build();
        return chatMessageRepository.save(chatMessage);
    }

    public List<ChatMessage> getChatMessagesBySenderAndReceiver(String senderId, String receiverId) {
        String chatRoomId = chatRoomService.getChatRoomId(senderId, receiverId);
        return chatMessageRepository.findByChatIdOrderByTimestampAsc(chatRoomId);
    }
}
