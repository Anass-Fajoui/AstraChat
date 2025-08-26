package com.example.ChatApp.Controllers;

import com.example.ChatApp.Models.ChatMessage;
import com.example.ChatApp.Models.DTOs.ChatMessageRequest;
import com.example.ChatApp.Services.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void sendMessage(@Payload ChatMessageRequest request, Principal principal) {
        request.setSenderId(principal.getName());
        ChatMessage chatMessage = chatMessageService.addChatMessage(request);

        messagingTemplate.convertAndSendToUser(request.getReceiverId(), "/queue/messages", chatMessage);
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(
            @Payload ChatMessage chatMessage
    ){
        return chatMessage;
    }

}

