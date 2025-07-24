package com.shehan.todo;

import com.shehan.todo.controller.TaskController;
import com.shehan.todo.dto.TaskDTO;
import com.shehan.todo.entity.User;
import com.shehan.todo.service.impl.TaskServiceImpl;
import com.shehan.todo.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TaskControllerTest {
    @Mock
    private TaskServiceImpl taskService;

    @Mock
    private UserServiceImpl userService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private TaskController taskController;

    private MockMvc mockMvc;
    private User user;
    private TaskDTO taskDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(taskController).build();
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        taskDTO = new TaskDTO();
        taskDTO.setId(1L);
        taskDTO.setTitle("Test Task");
        taskDTO.setDescription("Description");
        taskDTO.setCompleted(false);

        when(authentication.getName()).thenReturn("testuser");
        when(userService.findByUsername("testuser")).thenReturn(user);
    }

    @Test
    void testCreateTask() throws Exception {
        when(taskService.createTask(any(TaskDTO.class), any(User.class))).thenReturn(taskDTO);
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Test Task\",\"description\":\"Description\",\"completed\":false}")
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Task"));
    }

    @Test
    void testGetTasks() throws Exception {
        when(taskService.getTasksByUser(user)).thenReturn(Collections.singletonList(taskDTO));
        mockMvc.perform(get("/api/tasks")
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Task"));
    }
}
