package com.example.gamestore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartAddDTO {
    @NotNull(message = "用户ID必填")
    private Long userId;
    @NotNull(message = "商品ID必填")
    private Long gameId;
    @Min(value = 1, message = "数量至少为1")
    private Integer quantity;
}
