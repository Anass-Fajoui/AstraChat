package com.example.ChatApp.Config;

import com.example.ChatApp.Services.JwtService;
import com.example.ChatApp.Services.UserDetailsServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
@Slf4j
public class JwtAuthenticationInterceptor implements ChannelInterceptor {
    @Autowired
    private JwtService jwtTokenProvider;
    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        log.info("we are inside the jwt interceptor");

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String token = accessor.getFirstNativeHeader("Authorization");

            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);

                if (jwtTokenProvider.isTokenValid(token)) {
                    String email = jwtTokenProvider.extractEmail(token);
                    UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(email);
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(email, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    accessor.setUser(auth);
                    log.info("User connected: " + email);
                } else {
                    throw new IllegalArgumentException("Invalid JWT token");
                }
            } else {
                throw new IllegalArgumentException("Missing or invalid Authorization header");
            }
        }

        return message;
    }
}
