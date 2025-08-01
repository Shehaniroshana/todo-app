package com.shehan.todo.repository;

import com.shehan.todo.entity.Task;
import com.shehan.todo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
}
