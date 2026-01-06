package com.example.gamestore.controller;

import com.example.gamestore.common.ApiResponse;
import com.example.gamestore.common.PageResult;
import com.example.gamestore.dto.OrderCreateDTO;
import com.example.gamestore.entity.Order;
import com.example.gamestore.service.OrderService;
import com.example.gamestore.vo.OrderVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ApiResponse<Order> create(@Valid @RequestBody OrderCreateDTO dto) {
        return ApiResponse.success(orderService.create(dto));
    }

    @GetMapping
    public ApiResponse<PageResult<OrderVO>> list(@RequestParam Long userId,
                                                 @RequestParam int page,
                                                 @RequestParam int size) {
        return ApiResponse.success(orderService.pageUserOrders(userId, page, size));
    }
}
