package com.example.gamestore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class UserRegisterDTO {
    @NotBlank(message = "用户名必填")
    private String username;
    @NotBlank(message = "密码必填")
    private String password;
    @Email(message = "邮箱格式不正确")
    private String email;
    private String phone;
}
