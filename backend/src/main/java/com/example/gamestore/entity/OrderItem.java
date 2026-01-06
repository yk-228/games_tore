package com.example.gamestore.entity;

import lombok.Data;

@Data
public class OrderItem {
    private Long id;
    private Long orderId;
    private Long gameId;
    private java.math.BigDecimal price;
    private Integer quantity;
}
