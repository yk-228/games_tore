package com.example.gamestore.service;

import com.example.gamestore.common.PageResult;
import com.example.gamestore.entity.Game;

public interface GameService {
    PageResult<Game> pageQuery(int page, int size, Long categoryId, String keyword);

    Game findById(Long id);
}
