package com.example.ChatApp.Models.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    private String odUserId;
    private String name;
    private String username;
    private String lastMessage;
    private Instant lastMessageTime;
    private String lastMessageSenderId;
    private int unreadCount;
}
