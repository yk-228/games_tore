package com.example.gamestore.vo;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderVO {
    private Long orderId;
    private BigDecimal totalAmount;
    private Integer status;
    private LocalDateTime createdAt;
    private List<OrderItemVO> items;
}

@Data
class OrderItemVO {
    private Long gameId;
    private String gameName;
    private Integer quantity;
    private BigDecimal price;
}
