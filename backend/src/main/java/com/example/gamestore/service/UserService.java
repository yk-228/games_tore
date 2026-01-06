package com.example.gamestore.service;

import com.example.gamestore.dto.LoginDTO;
import com.example.gamestore.dto.UserProfileDTO;
import com.example.gamestore.dto.UserRegisterDTO;
import com.example.gamestore.entity.User;

public interface UserService {
    User register(UserRegisterDTO dto);

    User login(LoginDTO dto);

    void updateProfile(UserProfileDTO dto);

    User findById(Long id);
}
