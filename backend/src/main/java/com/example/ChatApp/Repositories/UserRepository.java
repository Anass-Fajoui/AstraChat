package com.example.ChatApp.Repositories;

import com.example.ChatApp.Models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    // Search users by username or name (case-insensitive)
    @Query("{ $or: [ { 'username': { $regex: ?0, $options: 'i' } }, { 'name': { $regex: ?0, $options: 'i' } } ] }")
    List<User> searchByUsernameOrName(String searchQuery);

    // Find users by list of IDs
    List<User> findByIdIn(List<String> ids);
}
