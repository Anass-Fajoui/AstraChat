package com.example.ChatApp.Services;

import com.example.ChatApp.Models.User;
import com.example.ChatApp.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;


}
