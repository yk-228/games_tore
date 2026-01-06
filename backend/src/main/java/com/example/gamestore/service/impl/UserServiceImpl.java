package com.example.gamestore.service.impl;

import com.example.gamestore.dao.UserMapper;
import com.example.gamestore.dto.LoginDTO;
import com.example.gamestore.dto.UserProfileDTO;
import com.example.gamestore.dto.UserRegisterDTO;
import com.example.gamestore.entity.User;
import com.example.gamestore.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public User register(UserRegisterDTO dto) {
        if (userMapper.findByUsername(dto.getUsername()) != null) {
            throw new IllegalArgumentException("用户名已存在");
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setRole(0);
        user.setCreatedAt(LocalDateTime.now());
        userMapper.insert(user);
        return userMapper.findByUsername(dto.getUsername());
    }

    @Override
    public User login(LoginDTO dto) {
        User user = userMapper.findByUsername(dto.getUsername());
        if (user == null || !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("用户名或密码错误");
        }
        return user;
    }

    @Override
    public void updateProfile(UserProfileDTO dto) {
        User user = userMapper.findByUsername(dto.getUsername());
        if (user == null) {
            throw new IllegalArgumentException("用户不存在");
        }
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setAvatar(dto.getAvatar());
        userMapper.updateProfile(user);
    }

    @Override
    public User findById(Long id) {
        return userMapper.findById(id);
    }

    private String encode(String raw) {
        return passwordEncoder.encode(raw);
    }
}
