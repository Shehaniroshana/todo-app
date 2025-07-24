package com.shehan.todo.controller;

import com.shehan.todo.dto.TaskDTO;
import com.shehan.todo.entity.User;
import com.shehan.todo.service.impl.TaskServiceImpl;
import com.shehan.todo.service.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskServiceImpl taskService;
    private final UserServiceImpl userService;

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        TaskDTO createdTask = taskService.createTask(taskDTO, user);
        return ResponseEntity.ok(createdTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        TaskDTO updatedTask = taskService.updateTask(id, taskDTO, user);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        taskService.deleteTask(id, user);
        return ResponseEntity.ok().body("Task deleted successfully");
    }

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getTasks(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        List<TaskDTO> tasks = taskService.getTasksByUser(user);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        TaskDTO task = taskService.getTaskById(id, user);
        return ResponseEntity.ok(task);
    }

}
