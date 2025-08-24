package com.example.ChatApp.Controllers;

import com.example.ChatApp.Models.ChatRoom;
import com.example.ChatApp.Services.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chatroom")
@RequiredArgsConstructor
public class ChatRoomController {
    private final ChatRoomService chatRoomService;

    @RequestMapping("/{userId}")
    public List<ChatRoom> getChatRoomMessage(@PathVariable String userId) {
        return chatRoomService.getChatRoomByUserId(userId);
    }

}
