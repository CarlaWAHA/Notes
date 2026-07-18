package com.example.demo.controller;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.service.TokenService;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final TokenService tokenService;

    public AuthController(UserService userService, TokenService tokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody AuthRequestDto authRequest) {
        return userService.findByUsername(authRequest.getUsername())
                .filter(user -> userService.checkPassword(user, authRequest.getPassword()))
                .map(user -> {
                    String token = tokenService.createToken(user);
                    return ResponseEntity.ok(new AuthResponseDto(token, user.getRoles(), user.getId(), user.getUsername()));
                })
                .orElseGet(() -> ResponseEntity.status(401).build());
    }
}
