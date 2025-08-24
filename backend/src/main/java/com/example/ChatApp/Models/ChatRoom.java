package com.example.ChatApp.Models;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document(collection = "chat_rooms")
public class ChatRoom {
    @Id
    private String id;
    private String firstUserId;
    private String secondUserId;
}
