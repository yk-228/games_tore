package com.example.gamestore.controller;

import com.example.gamestore.common.ApiResponse;
import com.example.gamestore.dto.CartAddDTO;
import com.example.gamestore.service.CartService;
import com.example.gamestore.vo.CartVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @PostMapping("/add")
    public ApiResponse<Void> add(@Valid @RequestBody CartAddDTO dto) {
        cartService.add(dto);
        return ApiResponse.success(null);
    }

    @GetMapping
    public ApiResponse<List<CartVO>> list(@RequestParam Long userId) {
        return ApiResponse.success(cartService.list(userId));
    }

    @PutMapping("/{cartId}")
    public ApiResponse<Void> update(@PathVariable Long cartId, @RequestParam Integer quantity) {
        cartService.updateQuantity(cartId, quantity);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{cartId}")
    public ApiResponse<Void> delete(@PathVariable Long cartId) {
        cartService.delete(cartId);
        return ApiResponse.success(null);
    }
}
