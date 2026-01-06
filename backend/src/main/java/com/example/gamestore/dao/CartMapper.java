package com.example.gamestore.dao;

import com.example.gamestore.entity.CartItem;
import com.example.gamestore.vo.CartVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CartMapper {
    CartItem findByUserAndGame(@Param("userId") Long userId, @Param("gameId") Long gameId);

    int insert(CartItem item);

    int updateQuantity(@Param("id") Long id, @Param("quantity") Integer quantity);

    int delete(@Param("id") Long id);

    List<CartVO> listByUser(@Param("userId") Long userId);
}
