package com.example.gamestore.dao;

import com.example.gamestore.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {
    User findByUsername(@Param("username") String username);

    int insert(User user);

    int updateProfile(User user);

    User findById(@Param("id") Long id);

    List<User> findAll();
}
