package com.example.ChatApp.Models;

import com.example.ChatApp.Models.Enums.MessageType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document(collection = "chat_messages")
public class ChatMessage {
    @Id
    private String id;
    private String chatId;
    private String senderId;
    private String receiverId;
    private String content;
}
