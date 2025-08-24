package com.example.ChatApp.Models.DTOs;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;

    private String username;

    private String email;

    private String password;
}
