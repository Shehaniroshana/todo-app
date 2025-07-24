package com.shehan.todo.service;

import com.shehan.todo.dto.RegisterRequest;
import com.shehan.todo.entity.User;

public interface UserService {
    User registerUser(RegisterRequest request);
    User findByUsername(String username);
}
