package com.example.gamestore.dao;

import com.example.gamestore.entity.Address;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AddressMapper {
    Address findById(@Param("id") Long id);
}
