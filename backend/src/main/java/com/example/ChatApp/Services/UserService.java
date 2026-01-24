package com.example.ChatApp.Services;

import com.example.ChatApp.Models.DTOs.UserDTO;
import com.example.ChatApp.Models.Mappers.UserMapper;
import com.example.ChatApp.Models.User;
import com.example.ChatApp.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public List<UserDTO> getAllUsers(){
        List<User> users = userRepository.findAll();
        return users.stream().map(userMapper::toDTO).collect(Collectors.toList());
    }

    public UserDTO getUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toDTO(user);
    }
}
