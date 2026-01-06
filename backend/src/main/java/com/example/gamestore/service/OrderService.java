package com.example.gamestore.service;

import com.example.gamestore.common.PageResult;
import com.example.gamestore.dto.OrderCreateDTO;
import com.example.gamestore.entity.Order;
import com.example.gamestore.vo.OrderVO;

public interface OrderService {
    Order create(OrderCreateDTO dto);

    PageResult<OrderVO> pageUserOrders(Long userId, int page, int size);
}
