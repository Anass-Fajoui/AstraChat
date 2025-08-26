package com.example.ChatApp.Models.DTOs;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String id;

    private String name;

    private String username;

    private String email;

    private String token;
}
