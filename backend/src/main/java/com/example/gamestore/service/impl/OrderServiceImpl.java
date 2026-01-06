package com.example.gamestore.service.impl;

import com.example.gamestore.common.PageResult;
import com.example.gamestore.dao.AddressMapper;
import com.example.gamestore.dao.CartMapper;
import com.example.gamestore.dao.OrderItemMapper;
import com.example.gamestore.dao.OrderMapper;
import com.example.gamestore.dto.OrderCreateDTO;
import com.example.gamestore.entity.CartItem;
import com.example.gamestore.entity.Order;
import com.example.gamestore.entity.OrderItem;
import com.example.gamestore.service.OrderService;
import com.example.gamestore.vo.CartVO;
import com.example.gamestore.vo.OrderVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final CartMapper cartMapper;
    private final AddressMapper addressMapper;

    @Override
    @Transactional
    public Order create(OrderCreateDTO dto) {
        if (addressMapper.findById(dto.getAddressId()) == null) {
            throw new IllegalArgumentException("地址不存在");
        }
        List<CartVO> cartList = cartMapper.listByUser(dto.getUserId());
        if (cartList.isEmpty()) {
            throw new IllegalArgumentException("购物车为空");
        }
        BigDecimal total = cartList.stream()
                .map(item -> item.getPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Order order = new Order();
        order.setUserId(dto.getUserId());
        order.setAddressId(dto.getAddressId());
        order.setTotalAmount(total);
        order.setStatus(0);
        order.setCreatedAt(LocalDateTime.now());
        orderMapper.insert(order);

        List<OrderItem> items = new ArrayList<>();
        for (CartVO vo : cartList) {
            OrderItem item = new OrderItem();
            item.setOrderId(order.getId());
            item.setGameId(vo.getGameId());
            item.setPrice(vo.getPrice());
            item.setQuantity(vo.getQuantity());
            items.add(item);
        }
        if (!items.isEmpty()) {
            orderItemMapper.insertBatch(items);
        }
        // 清空购物车
        for (CartVO vo : cartList) {
            cartMapper.delete(vo.getCartId());
        }
        return order;
    }

    @Override
    public PageResult<OrderVO> pageUserOrders(Long userId, int page, int size) {
        int offset = (page - 1) * size;
        Map<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        params.put("offset", offset);
        params.put("pageSize", size);
        List<OrderVO> list = orderMapper.listByUser(params);
        long total = orderMapper.countByUser(userId);
        return new PageResult<>(total, list);
    }
}
