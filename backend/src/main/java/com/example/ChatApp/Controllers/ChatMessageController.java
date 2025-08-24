package com.example.ChatApp.Controllers;

import com.example.ChatApp.Models.ChatMessage;
import com.example.ChatApp.Services.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/message")
@RequiredArgsConstructor
public class ChatMessageController {
    private final ChatMessageService chatMessageService;

    @GetMapping("/{senderId}/{receiverId}")
    public List<ChatMessage> getMessagesBySenderAndReceiver(@PathVariable String senderId,
                                                            @PathVariable String receiverId) {
        return chatMessageService.getChatMessagesBySenderAndReceiver(senderId, receiverId);
    }
}
