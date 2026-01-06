package com.example.gamestore.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CartItem {
    private Long id;
    private Long userId;
    private Long gameId;
    private Integer quantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
