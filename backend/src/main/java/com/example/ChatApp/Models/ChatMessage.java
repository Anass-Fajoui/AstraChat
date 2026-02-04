package com.example.ChatApp.Models;

import com.example.ChatApp.Models.Enums.MessageType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@Document(collection = "chat_messages")
@CompoundIndexes({
        @CompoundIndex(name = "chat_timestamp_idx", def = "{'chatId': 1, 'timestamp': -1}")
})
public class ChatMessage {
    @Id
    private String id;

    @Indexed
    private String chatId;

    @Indexed
    private String senderId;

    @Indexed
    private String receiverId;

    private String content;

    @Builder.Default
    @Indexed
    private Instant timestamp = Instant.now();
}
