package com.example.demo.service;

import com.example.demo.model.User;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class TokenService {

    private final ConcurrentMap<String, User> tokenToUser = new ConcurrentHashMap<>();

    public String createToken(User user) {
        String token = UUID.randomUUID().toString();
        tokenToUser.put(token, user);
        return token;
    }

    public Optional<User> findByToken(String token) {
        return Optional.ofNullable(tokenToUser.get(token));
    }
}
