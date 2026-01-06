package com.example.gamestore.vo;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartVO {
    private Long cartId;
    private Long gameId;
    private String gameName;
    private String coverUrl;
    private BigDecimal price;
    private Integer quantity;
}
