package com.example.gamestore.service.impl;

import com.example.gamestore.dao.CategoryMapper;
import com.example.gamestore.entity.Category;
import com.example.gamestore.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryMapper categoryMapper;

    @Override
    public List<Category> list() {
        return categoryMapper.findAll();
    }
}
