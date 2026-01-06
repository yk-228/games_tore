package com.example.gamestore.dao;

import com.example.gamestore.entity.Order;
import com.example.gamestore.vo.OrderVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface OrderMapper {
    int insert(Order order);

    List<OrderVO> listByUser(Map<String, Object> params);

    long countByUser(@Param("userId") Long userId);
}
