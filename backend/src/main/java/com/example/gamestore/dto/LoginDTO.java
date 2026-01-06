package com.example.gamestore.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDTO {
    @NotBlank(message = "用户名必填")
    private String username;
    @NotBlank(message = "密码必填")
    private String password;
}
