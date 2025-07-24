package com.shehan.todo.service.impl;

import com.shehan.todo.dto.TaskDTO;
import com.shehan.todo.entity.User;
import com.shehan.todo.service.TaskService;

import java.util.List;

public class TaskServiceImpl implements TaskService {
    @Override
    public TaskDTO createTask(TaskDTO taskDTO, User user) {
        return null;
    }

    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO, User user) {
        return null;
    }

    @Override
    public void deleteTask(Long id, User user) {

    }

    @Override
    public List<TaskDTO> getTasksByUser(User user) {
        return List.of();
    }

    @Override
    public TaskDTO getTaskById(Long id, User user) {
        return null;
    }
}
