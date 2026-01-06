package com.example.gamestore.entity;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class Order {
    private Long id;
    private Long userId;
    private BigDecimal totalAmount;
    private Integer status;
    private Long addressId;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
}
