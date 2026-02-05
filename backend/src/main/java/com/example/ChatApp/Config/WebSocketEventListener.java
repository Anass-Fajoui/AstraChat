package com.example.ChatApp.Config;

import com.example.ChatApp.Models.ChatMessage;
import com.example.ChatApp.Models.DTOs.UserDTO;
import com.example.ChatApp.Models.Enums.MessageType;
import com.example.ChatApp.Models.User;
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
import java.time.Instant;
import java.util.HashSet;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;
    private final UserRepository userRepository;

    private HashSet<UserDTO> onlineUsers = new HashSet<>();

    @EventListener
    public void handleConnectEvent(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal user = accessor.getUser();

        log.info("New User connected");
        if (user != null) {
            log.info("User connected: " + user.getName());

            // Update user online status in database
            User dbUser = userRepository.findById(user.getName()).orElse(null);
            if (dbUser != null) {
                dbUser.setOnline(true);
                dbUser.setLastSeen(Instant.now());
                userRepository.save(dbUser);
            }
        }
        UserDTO onlineUser = userService.getUser(user.getName());
        onlineUsers.add(onlineUser);

        messagingTemplate.convertAndSend("/topic/online", onlineUsers);

        // Broadcast status change to all users
        messagingTemplate.convertAndSend("/topic/status", Map.of(
                "userId", user.getName(),
                "isOnline", true,
                "lastSeen", Instant.now().toString()));
    }

    @EventListener
    public void handleDisconnectEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal user = accessor.getUser();

        log.info("New User disconnected");
        if (user != null) {
            log.info("User disconnected: " + user.getName());

            // Update user offline status in database
            User dbUser = userRepository.findById(user.getName()).orElse(null);
            Instant lastSeenTime = Instant.now();
            if (dbUser != null) {
                dbUser.setOnline(false);
                dbUser.setLastSeen(lastSeenTime);
                userRepository.save(dbUser);
            }

            // Broadcast status change to all users
            messagingTemplate.convertAndSend("/topic/status", Map.of(
                    "userId", user.getName(),
                    "isOnline", false,
                    "lastSeen", lastSeenTime.toString()));
        }

        UserDTO onlineUser = userService.getUser(user.getName());
        onlineUsers.remove(onlineUser);

        messagingTemplate.convertAndSend("/topic/online", onlineUsers);
    }
}
