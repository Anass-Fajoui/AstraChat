package com.example.ChatApp.Models;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document(collection = "chat_rooms")
@CompoundIndexes({
        @CompoundIndex(name = "user_pair_idx", def = "{'firstUserId': 1, 'secondUserId': 1}", unique = true)
})
public class ChatRoom {
    @Id
    private String id;

    @Indexed
    private String firstUserId;

    @Indexed
    private String secondUserId;
}
