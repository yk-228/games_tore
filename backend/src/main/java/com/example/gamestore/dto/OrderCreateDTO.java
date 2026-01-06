package com.example.gamestore.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderCreateDTO {
    @NotNull(message = "用户ID必填")
    private Long userId;
    @NotNull(message = "地址ID必填")
    private Long addressId;
}
