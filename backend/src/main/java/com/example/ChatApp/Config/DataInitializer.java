package com.example.ChatApp.Config;

import com.example.ChatApp.Models.ChatMessage;
import com.example.ChatApp.Models.ChatRoom;
import com.example.ChatApp.Models.User;
import com.example.ChatApp.Repositories.ChatMessageRepository;
import com.example.ChatApp.Repositories.ChatRoomRepository;
import com.example.ChatApp.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
@Profile("!test") // Don't run in test profile
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final PasswordEncoder passwordEncoder;

    // Demo user data
    private static final List<DemoUser> DEMO_USERS = List.of(
            new DemoUser("Alice Johnson", "alice", "alice@demo.com", "password123",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
                    "Software engineer who loves hiking and coffee ☕"),
            new DemoUser("Bob Smith", "bob", "bob@demo.com", "password123",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                    "Full-stack developer | Open source enthusiast"),
            new DemoUser("Carol Williams", "carol", "carol@demo.com", "password123",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                    "UX Designer | Creating beautiful experiences"),
            new DemoUser("David Brown", "david", "david@demo.com", "password123",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
                    "DevOps engineer | Cloud architecture"),
            new DemoUser("Emma Davis", "emma", "emma@demo.com", "password123",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
                    "Product Manager | Building the future"),
            new DemoUser("Frank Miller", "frank", "frank@demo.com", "password123",
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                    "Backend developer | Java & Spring Boot"),
            new DemoUser("Grace Lee", "grace", "grace@demo.com", "password123",
                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
                    "Frontend developer | React enthusiast"),
            new DemoUser("Henry Wilson", "henry", "henry@demo.com", "password123",
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
                    "Mobile developer | iOS & Android"),
            new DemoUser("Ivy Chen", "ivy", "ivy@demo.com", "password123",
                    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
                    "Data scientist | ML & AI"),
            new DemoUser("Jack Taylor", "jack", "jack@demo.com", "password123",
                    "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
                    "Security engineer | Keeping systems safe"));

    // Sample conversation messages
    private static final List<String[]> CONVERSATIONS = List.of(
            new String[] { "Hey! How's the new project going?", "It's going great! Just finished the API design.",
                    "Nice! Can't wait to see it in action.", "I'll demo it tomorrow at standup." },
            new String[] { "Did you see the latest tech news?", "Yeah, the new framework looks promising!",
                    "We should try it on our next project.", "Agreed, let's discuss it with the team." },
            new String[] { "Coffee break?", "Sure! Meet you in 5 minutes.", "Perfect, see you there!", "☕" },
            new String[] { "The code review is done.", "Any major issues?", "Just a few minor suggestions.",
                    "I'll fix them right away. Thanks!" },
            new String[] { "Happy Friday! 🎉", "Finally! Any plans for the weekend?", "Thinking of going hiking.",
                    "That sounds amazing! Have fun!" },
            new String[] { "Quick question about the database schema.", "Sure, what's up?",
                    "Should we normalize the user preferences table?",
                    "Good idea, let's create a migration for that." },
            new String[] { "The deployment was successful!", "Awesome! No issues in production?",
                    "Everything looks stable.", "Great job team! 🚀" },
            new String[] { "Can you help me with this bug?", "Of course! What's happening?",
                    "The websocket connection keeps dropping.", "Let me check the logs. I think I know what it is." },
            new String[] { "Meeting in 10 minutes.", "On my way!", "Don't forget the presentation.",
                    "Got it, thanks for the reminder!" },
            new String[] { "The new feature is live!", "Users are loving it!", "We got 100 signups in the first hour.",
                    "This is incredible! Great work everyone!" });

    @Override
    public void run(String... args) {
        // Check if data already exists
        if (userRepository.count() > 0) {
            log.info("Database already populated. Skipping initialization.");
            return;
        }

        log.info("Starting database initialization with demo data...");

        // Create users
        List<User> users = createUsers();
        log.info("Created {} demo users", users.size());

        // Create conversations between users
        createConversations(users);
        log.info("Created demo conversations");

        log.info("Database initialization complete!");
        printCredentials();
    }

    private List<User> createUsers() {
        List<User> users = new ArrayList<>();
        for (DemoUser demoUser : DEMO_USERS) {
            User user = new User();
            user.setName(demoUser.name);
            user.setUsername(demoUser.username);
            user.setEmail(demoUser.email);
            user.setPassword(passwordEncoder.encode(demoUser.password));
            user.setAvatarUrl(demoUser.avatarUrl);
            user.setBio(demoUser.bio);
            users.add(userRepository.save(user));
        }
        return users;
    }

    private void createConversations(List<User> users) {
        Random random = new Random(42); // Fixed seed for reproducibility
        int conversationIndex = 0;

        // Create conversations between different user pairs
        for (int i = 0; i < users.size(); i++) {
            for (int j = i + 1; j < users.size(); j++) {
                // Only create conversations for some pairs (not all)
                if (random.nextDouble() < 0.4) { // 40% chance of conversation
                    User user1 = users.get(i);
                    User user2 = users.get(j);

                    // Create chat room
                    String chatId = generateChatId(user1.getId(), user2.getId());
                    ChatRoom chatRoom = ChatRoom.builder()
                            .id(chatId)
                            .firstUserId(user1.getId())
                            .secondUserId(user2.getId())
                            .build();
                    chatRoomRepository.save(chatRoom);

                    // Get conversation messages
                    String[] messages = CONVERSATIONS.get(conversationIndex % CONVERSATIONS.size());
                    conversationIndex++;

                    // Create messages with timestamps going back in time
                    Instant baseTime = Instant.now().minus(random.nextInt(7), ChronoUnit.DAYS);

                    for (int k = 0; k < messages.length; k++) {
                        ChatMessage message = ChatMessage.builder()
                                .chatId(chatId)
                                .senderId(k % 2 == 0 ? user1.getId() : user2.getId())
                                .receiverId(k % 2 == 0 ? user2.getId() : user1.getId())
                                .content(messages[k])
                                .timestamp(baseTime.plus(k * 5, ChronoUnit.MINUTES))
                                .build();
                        chatMessageRepository.save(message);
                    }
                }
            }
        }
    }

    private String generateChatId(String id1, String id2) {
        return id1.compareTo(id2) < 0 ? id1 + "_" + id2 : id2 + "_" + id1;
    }

    private void printCredentials() {
        log.info("\n" + "=".repeat(60));
        log.info("DEMO USER CREDENTIALS");
        log.info("=".repeat(60));
        log.info(String.format("%-25s %-25s %s", "EMAIL", "PASSWORD", "NAME"));
        log.info("-".repeat(60));
        for (DemoUser user : DEMO_USERS) {
            log.info(String.format("%-25s %-25s %s", user.email, user.password, user.name));
        }
        log.info("=".repeat(60) + "\n");
    }

    private record DemoUser(String name, String username, String email, String password, String avatarUrl, String bio) {
    }
}
