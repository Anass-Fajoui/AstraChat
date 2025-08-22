package com.example.ChatApp.Models;

import com.example.ChatApp.Models.Enums.MessageType;
import lombok.*;

@Data
@Builder
public class ChatMessage {
    private String content;
    private String sender;
    private MessageType type;
}
