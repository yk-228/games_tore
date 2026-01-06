package com.example.gamestore.service.impl;

import com.example.gamestore.dao.CartMapper;
import com.example.gamestore.dto.CartAddDTO;
import com.example.gamestore.entity.CartItem;
import com.example.gamestore.service.CartService;
import com.example.gamestore.vo.CartVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartMapper cartMapper;

    @Override
    public void add(CartAddDTO dto) {
        CartItem exist = cartMapper.findByUserAndGame(dto.getUserId(), dto.getGameId());
        if (exist != null) {
            long sum = (long) exist.getQuantity() + dto.getQuantity();
            if (sum > Integer.MAX_VALUE) {
                throw new IllegalArgumentException("数量超出上限");
            }
            cartMapper.updateQuantity(exist.getId(), (int) sum);
            return;
        }
        CartItem item = new CartItem();
        item.setUserId(dto.getUserId());
        item.setGameId(dto.getGameId());
        item.setQuantity(dto.getQuantity());
        item.setCreatedAt(LocalDateTime.now());
        cartMapper.insert(item);
    }

    @Override
    public List<CartVO> list(Long userId) {
        return cartMapper.listByUser(userId);
    }

    @Override
    public void updateQuantity(Long cartId, Integer quantity) {
        cartMapper.updateQuantity(cartId, quantity);
    }

    @Override
    public void delete(Long cartId) {
        cartMapper.delete(cartId);
    }
}
