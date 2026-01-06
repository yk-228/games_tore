package com.example.gamestore.service.impl;

import com.example.gamestore.common.PageResult;
import com.example.gamestore.dao.GameMapper;
import com.example.gamestore.entity.Game;
import com.example.gamestore.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {
    private final GameMapper gameMapper;

    @Override
    public PageResult<Game> pageQuery(int page, int size, Long categoryId, String keyword) {
        int offset = (page - 1) * size;
        Map<String, Object> params = new HashMap<>();
        params.put("offset", offset);
        params.put("pageSize", size);
        params.put("categoryId", categoryId);
        params.put("keyword", keyword);
        List<Game> list = gameMapper.selectPage(params);
        long total = gameMapper.count(params);
        return new PageResult<>(total, list);
    }

    @Override
    public Game findById(Long id) {
        return gameMapper.findById(id);
    }
}
