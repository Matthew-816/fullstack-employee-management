package com.example.EmployeeManagementSystem.controller.admin;

import com.example.EmployeeManagementSystem.dto.request.AiChatBoxRequestDTO;
import com.example.EmployeeManagementSystem.dto.response.AiChatBoxResponseDTO;
import com.example.EmployeeManagementSystem.service.AiChatBoxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class AiChatBoxController {

    @Autowired
    private AiChatBoxService employeeSearchService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/search-employees")
    public void searchEmployees(AiChatBoxRequestDTO request) {
        try {
            System.out.println("Received request: " + request.getDescription());
            List<AiChatBoxResponseDTO> employees = employeeSearchService.searchEmployees(request.getDescription());
            messagingTemplate.convertAndSend("/topic/employee-search", employees);
        } catch (Exception e) {
            messagingTemplate.convertAndSend("/topic/employee-search",
                    List.of(AiChatBoxResponseDTO.builder()
                            .firstName("Error: " + e.getMessage())
                            .build()));
        }
    }
}