package com.example.gamestore.controller;

import com.example.gamestore.common.ApiResponse;
import com.example.gamestore.dto.LoginDTO;
import com.example.gamestore.dto.UserProfileDTO;
import com.example.gamestore.dto.UserRegisterDTO;
import com.example.gamestore.entity.User;
import com.example.gamestore.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ApiResponse<User> register(@Valid @RequestBody UserRegisterDTO dto) {
        return ApiResponse.success(userService.register(dto));
    }

    @PostMapping("/login")
    public ApiResponse<User> login(@Valid @RequestBody LoginDTO dto) {
        return ApiResponse.success(userService.login(dto));
    }

    @PutMapping("/profile")
    public ApiResponse<Void> update(@Valid @RequestBody UserProfileDTO dto) {
        userService.updateProfile(dto);
        return ApiResponse.success(null);
    }

    @GetMapping("/{id}")
    public ApiResponse<User> detail(@PathVariable Long id) {
        return ApiResponse.success(userService.findById(id));
    }
}
