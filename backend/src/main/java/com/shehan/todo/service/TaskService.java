package com.shehan.todo.service;

import com.shehan.todo.dto.TaskDTO;
import com.shehan.todo.entity.User;

import java.util.List;

public interface TaskService {
    TaskDTO createTask(TaskDTO taskDTO, User user);
    TaskDTO updateTask(Long id, TaskDTO taskDTO, User user);
    void deleteTask(Long id, User user);
    List<TaskDTO> getTasksByUser(User user);
    TaskDTO getTaskById(Long id, User user);
}
