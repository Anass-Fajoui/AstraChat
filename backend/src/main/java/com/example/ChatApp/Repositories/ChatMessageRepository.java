package com.example.ChatApp.Repositories;

import com.example.ChatApp.Models.ChatMessage;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByChatId(String chatId);

    // Find messages by chatId sorted by timestamp
    List<ChatMessage> findByChatIdOrderByTimestampAsc(String chatId);

    // Find the latest message in a chat room
    Optional<ChatMessage> findFirstByChatIdOrderByTimestampDesc(String chatId);

    // Find all messages involving a user (as sender or receiver)
    @Query("{ $or: [ { 'senderId': ?0 }, { 'receiverId': ?0 } ] }")
    List<ChatMessage> findAllByUserId(String userId);
}
