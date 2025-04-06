package com.example.EmployeeManagementSystem.exception;

import com.example.EmployeeManagementSystem.dto.response.ApiResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(EmployeeNotFoundException.class)
    public ApiResponseDTO<?> handleEmployeeNotFoundException(EmployeeNotFoundException ex) {
        return ApiResponseDTO.error(ex.getMessage());
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(RuntimeException.class)
    public ApiResponseDTO<?> handleRuntimeException(RuntimeException ex) {
        return ApiResponseDTO.error(ex.getMessage());
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public ApiResponseDTO<?> handleException(Exception ex) {
        return ApiResponseDTO.error("An error occurred");
    }
}