package com.example.ChatApp.Models.DTOs;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;

    private String password;
}
