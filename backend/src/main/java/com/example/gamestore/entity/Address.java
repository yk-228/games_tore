package com.example.gamestore.entity;

import lombok.Data;

@Data
public class Address {
    private Long id;
    private Long userId;
    private String consignee;
    private String phone;
    private String detail;
    private Integer isDefault;
}
