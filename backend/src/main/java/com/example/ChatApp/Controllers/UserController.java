package com.example.ChatApp.Controllers;

import com.example.ChatApp.Models.DTOs.ConversationDTO;
import com.example.ChatApp.Models.DTOs.UserDTO;
import com.example.ChatApp.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable String id) {
        return userService.getUser(id);
    }

    /**
     * Search users by username or name
     * 
     * @param query         search query string
     * @param currentUserId ID of the current user (to exclude from results)
     * @param limit         maximum number of results to return (default 20)
     */
    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(
            @RequestParam String query,
            @RequestParam String currentUserId,
            @RequestParam(defaultValue = "20") int limit) {
        List<UserDTO> results = userService.searchUsers(query, currentUserId, limit);
        return ResponseEntity.ok(results);
    }

    /**
     * Get all conversations for a user (users they have chatted with before)
     * Returns conversation info sorted by last message time
     */
    @GetMapping("/{userId}/conversations")
    public ResponseEntity<List<ConversationDTO>> getConversations(@PathVariable String userId) {
        List<ConversationDTO> conversations = userService.getConversations(userId);
        return ResponseEntity.ok(conversations);
    }
}
