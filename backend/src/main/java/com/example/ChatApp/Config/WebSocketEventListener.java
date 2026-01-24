package com.example.ChatApp.Config;

import com.example.ChatApp.Models.ChatMessage;
import com.example.ChatApp.Models.DTOs.UserDTO;
import com.example.ChatApp.Models.Enums.MessageType;
import com.example.ChatApp.Repositories.UserRepository;
import com.example.ChatApp.Services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.HashSet;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    private HashSet<UserDTO> onlineUsers = new HashSet<>();

    @EventListener
    public void handleConnectEvent(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal user = accessor.getUser();

        log.info("New User connected");
        if (user != null) {
            log.info("User connected: " + user.getName());
        }
        UserDTO onlineUser = userService.getUser(user.getName());
        onlineUsers.add(onlineUser);

        messagingTemplate.convertAndSend("/topic/online", onlineUsers);
    }

    @EventListener
    public void handleDisconnectEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal user = accessor.getUser();

        log.info("New User disconnected");
        if (user != null) {
            log.info("User disconnected: " + user.getName());
        }

        UserDTO onlineUser = userService.getUser(user.getName());
        onlineUsers.remove(onlineUser);

        messagingTemplate.convertAndSend("/topic/online", onlineUsers);
    }
}
