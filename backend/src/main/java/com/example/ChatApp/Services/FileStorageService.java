package com.example.ChatApp.Services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Value("${server.base-url:http://localhost:8080}")
    private String serverBaseUrl;

    private Path uploadPath;

    @PostConstruct
    public void init() {
        uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadPath);
            Files.createDirectories(uploadPath.resolve("avatars"));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    /**
     * Store an avatar file and return the URL
     */
    public String storeAvatar(MultipartFile file, String userId) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        // Check file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File size must be less than 5MB");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = userId + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;

        // Store file
        Path avatarPath = uploadPath.resolve("avatars").resolve(filename);
        Files.copy(file.getInputStream(), avatarPath, StandardCopyOption.REPLACE_EXISTING);

        // Return URL
        return serverBaseUrl + "/api/files/avatars/" + filename;
    }

    /**
     * Delete an avatar file
     */
    public void deleteAvatar(String avatarUrl) {
        if (avatarUrl == null || avatarUrl.isEmpty()) {
            return;
        }

        try {
            String filename = avatarUrl.substring(avatarUrl.lastIndexOf("/") + 1);
            Path avatarPath = uploadPath.resolve("avatars").resolve(filename);
            Files.deleteIfExists(avatarPath);
        } catch (IOException e) {
            // Log error but don't throw - deletion failure shouldn't break the flow
            System.err.println("Failed to delete avatar file: " + e.getMessage());
        }
    }

    /**
     * Get the path to an avatar file
     */
    public Path getAvatarPath(String filename) {
        return uploadPath.resolve("avatars").resolve(filename);
    }
}
