package com.example.gamestore.dao;

import com.example.gamestore.entity.Game;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface GameMapper {
    List<Game> selectPage(Map<String, Object> params);

    long count(Map<String, Object> params);

    Game findById(@Param("id") Long id);
}
