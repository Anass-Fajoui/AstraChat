package com.example.ChatApp.Controllers;

import com.example.ChatApp.Models.ChatMessage;
import com.example.ChatApp.Models.DTOs.ChatMessageRequest;
import com.example.ChatApp.Models.User;
import com.example.ChatApp.Repositories.UserRepository;
import com.example.ChatApp.Services.ChatMessageService;
import com.example.ChatApp.Services.ChatRoomService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    @MessageMapping("/chat")
    public void sendMessage(@Payload ChatMessageRequest request) {
        ChatMessage chatMessage = chatMessageService.addChatMessage(request);
        User user = userRepository.findById(chatMessage.getReceiverId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        messagingTemplate.convertAndSendToUser(user.getEmail(), "/queue/messages", chatMessage);
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(
            @Payload ChatMessage chatMessage
    ){
        return chatMessage;
    }

    @MessageMapping("/chatpublic")
    @SendTo("/topic/messages")
    public NewChatMessage sendMessage(NewChatMessage message) {
        return message;
    }
}

@Data
class NewChatMessage {
    private String message;
    private String sender;

}