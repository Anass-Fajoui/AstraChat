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
public class UserDTO {
    private String id;

    private String name;

    private String username;

    private String email;

    private String avatarUrl;

    private String bio;

    private boolean online;

    private Instant lastSeen;
}
