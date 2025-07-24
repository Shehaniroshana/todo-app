package com.shehan.todo.service.impl;

import com.shehan.todo.dto.TaskDTO;
import com.shehan.todo.entity.Task;
import com.shehan.todo.entity.User;
import com.shehan.todo.exception.ResourceNotFoundException;
import com.shehan.todo.repository.TaskRepository;
import com.shehan.todo.service.TaskService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Override
    public TaskDTO createTask(TaskDTO taskDTO, User user) {
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setCompleted(taskDTO.isCompleted());
        task.setUser(user);
        task = taskRepository.save(task);
        return mapToDTO(task);
    }

    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO, User user) {
        Task task = taskRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Task not found or not authorized"));
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setCompleted(taskDTO.isCompleted());
        task = taskRepository.save(task);
        return mapToDTO(task);
    }

    @Override
    public void deleteTask(Long id, User user) {
        Task task = taskRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Task not found or not authorized"));
        taskRepository.delete(task);
    }

    @Override
    public List<TaskDTO> getTasksByUser(User user) {
        return taskRepository.findByUser(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDTO getTaskById(Long id, User user) {
        Task task = taskRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Task not found or not authorized"));
        return mapToDTO(task);    }

    private TaskDTO mapToDTO(Task task) {
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setId(task.getId());
        taskDTO.setTitle(task.getTitle());
        taskDTO.setDescription(task.getDescription());
        taskDTO.setCompleted(task.isCompleted());
        taskDTO.setCreatedAt(task.getCreatedAt());
        return taskDTO;
    }
}
