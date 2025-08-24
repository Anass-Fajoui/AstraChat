package com.example.ChatApp.Repositories;

import com.example.ChatApp.Models.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    Optional<ChatRoom> findByFirstUserIdAndSecondUserId(String firstUserId, String secondUserId);
    List<ChatRoom> findByFirstUserIdOrSecondUserId(String firstUserId, String secondUserId);
}
