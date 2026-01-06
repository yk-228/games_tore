package com.example.gamestore.dao;

import com.example.gamestore.entity.OrderItem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderItemMapper {
    int insertBatch(@Param("items") List<OrderItem> items);
}
