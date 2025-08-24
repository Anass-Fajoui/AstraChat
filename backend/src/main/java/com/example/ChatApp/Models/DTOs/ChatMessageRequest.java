package com.example.ChatApp.Models.DTOs;

import lombok.Data;

@Data
public class ChatMessageRequest {
    private String senderId;
    private String receiverId;
    private String content;
}
