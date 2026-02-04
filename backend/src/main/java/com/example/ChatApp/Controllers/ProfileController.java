package com.example.ChatApp.Controllers;

import com.example.ChatApp.Exceptions.UserNotFoundException;
import com.example.ChatApp.Models.DTOs.PasswordChangeRequest;
import com.example.ChatApp.Models.DTOs.ProfileUpdateRequest;
import com.example.ChatApp.Models.DTOs.UserDTO;
import com.example.ChatApp.Models.Mappers.UserMapper;
import com.example.ChatApp.Models.User;
import com.example.ChatApp.Repositories.UserRepository;
import com.example.ChatApp.Services.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get current user's profile
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getProfile(@PathVariable String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("id", userId));
        return ResponseEntity.ok(userMapper.toDTO(user));
    }

    /**
     * Update user profile (name, username, email, bio)
     */
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable String userId,
            @RequestBody ProfileUpdateRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("id", userId));

        // Check if username is being changed and if it's already taken
        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            Optional<User> existingUser = userRepository.findByUsername(request.getUsername());
            if (existingUser.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Username is already taken"));
            }
            user.setUsername(request.getUsername());
        }

        // Check if email is being changed and if it's already taken
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
            if (existingUser.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email is already in use"));
            }
            user.setEmail(request.getEmail());
        }

        // Update other fields
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(userMapper.toDTO(savedUser));
    }

    /**
     * Change user password
     */
    @PutMapping("/{userId}/password")
    public ResponseEntity<?> changePassword(
            @PathVariable String userId,
            @RequestBody PasswordChangeRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("id", userId));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Current password is incorrect"));
        }

        // Validate new password
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "New password must be at least 6 characters"));
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    /**
     * Upload avatar
     */
    @PostMapping("/{userId}/avatar")
    public ResponseEntity<?> uploadAvatar(
            @PathVariable String userId,
            @RequestParam("file") MultipartFile file) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("id", userId));

        try {
            // Delete old avatar if exists
            if (user.getAvatarUrl() != null) {
                fileStorageService.deleteAvatar(user.getAvatarUrl());
            }

            // Store new avatar
            String avatarUrl = fileStorageService.storeAvatar(file, userId);
            user.setAvatarUrl(avatarUrl);
            User savedUser = userRepository.save(user);

            return ResponseEntity.ok(userMapper.toDTO(savedUser));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload avatar"));
        }
    }

    /**
     * Delete avatar
     */
    @DeleteMapping("/{userId}/avatar")
    public ResponseEntity<?> deleteAvatar(@PathVariable String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("id", userId));

        if (user.getAvatarUrl() != null) {
            fileStorageService.deleteAvatar(user.getAvatarUrl());
            user.setAvatarUrl(null);
            userRepository.save(user);
        }

        return ResponseEntity.ok(Map.of("message", "Avatar deleted successfully"));
    }
}
