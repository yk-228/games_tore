package com.example.gamestore.service;

import com.example.gamestore.dto.CartAddDTO;
import com.example.gamestore.vo.CartVO;

import java.util.List;

public interface CartService {
    void add(CartAddDTO dto);

    List<CartVO> list(Long userId);

    void updateQuantity(Long cartId, Integer quantity);

    void delete(Long cartId);
}
