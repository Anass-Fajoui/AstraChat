package com.example.ChatApp.Models.Mappers;

import com.example.ChatApp.Models.DTOs.UserDTO;
import com.example.ChatApp.Models.User;
import org.springframework.stereotype.Component;


@Component
public class UserMapper {
    public UserDTO toDTO(User user) {

        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());

        return userDTO;
    }
}
