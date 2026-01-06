package com.example.gamestore.controller;

import com.example.gamestore.common.ApiResponse;
import com.example.gamestore.entity.Category;
import com.example.gamestore.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<Category>> list() {
        return ApiResponse.success(categoryService.list());
    }
}
