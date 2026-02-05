package com.example.ChatApp.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;

    @TextIndexed
    private String name;

    @Indexed(unique = true)
    @TextIndexed
    private String username;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String avatarUrl;

    private String bio;

    private boolean online;

    private Instant lastSeen;
}