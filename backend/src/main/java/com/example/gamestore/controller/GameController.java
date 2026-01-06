package com.example.gamestore.controller;

import com.example.gamestore.common.ApiResponse;
import com.example.gamestore.common.PageResult;
import com.example.gamestore.entity.Game;
import com.example.gamestore.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameController {
    private final GameService gameService;

    @GetMapping
    public ApiResponse<PageResult<Game>> list(@RequestParam int page,
                                              @RequestParam int size,
                                              @RequestParam(required = false) Long categoryId,
                                              @RequestParam(required = false) String keyword) {
        return ApiResponse.success(gameService.pageQuery(page, size, categoryId, keyword));
    }

    @GetMapping("/{id}")
    public ApiResponse<Game> detail(@PathVariable Long id) {
        return ApiResponse.success(gameService.findById(id));
    }
}
