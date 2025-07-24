package com.shehan.todo.integration;

import com.shehan.todo.dto.RegisterRequest;
import com.shehan.todo.dto.TaskDTO;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class TaskIntegrationTest {
    @Container
    private static final MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("todoapp")
            .withUsername("root")
            .withPassword("your_password");

    @Autowired
    private TestRestTemplate restTemplate;

    @BeforeAll
    static void setUp() {
        mySQLContainer.start();
        System.setProperty("spring.datasource.url", mySQLContainer.getJdbcUrl());
        System.setProperty("spring.datasource.username", mySQLContainer.getUsername());
        System.setProperty("spring.datasource.password", mySQLContainer.getPassword());
    }

    @Test
    void testCreateTask() {
        // Register user
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setPassword("password");
        registerRequest.setEmail("test@example.com");
        restTemplate.postForEntity("/api/auth/register", registerRequest, String.class);

        // Login to get token
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> loginRequest = new HttpEntity<>(
                "{\"username\":\"testuser\",\"password\":\"password\"}", headers);
        ResponseEntity<String> loginResponse = restTemplate.postForEntity("/api/auth/login", loginRequest, String.class);
        String token = loginResponse.getBody().split("\"token\":\"")[1].split("\"")[0];

        // Create task
        headers.set("Authorization", "Bearer " + token);
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setTitle("Test Task");
        taskDTO.setDescription("Description");
        HttpEntity<TaskDTO> taskRequest = new HttpEntity<>(taskDTO, headers);
        ResponseEntity<TaskDTO> taskResponse = restTemplate.postForEntity("/api/tasks", taskRequest, TaskDTO.class);
        assertEquals(HttpStatus.OK, taskResponse.getStatusCode());
        assertEquals("Test Task", taskResponse.getBody().getTitle());
    }
}