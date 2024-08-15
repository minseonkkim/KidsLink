package com.ssafy.kidslink.common.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.kidslink.common.dto.APIError;
import com.ssafy.kidslink.common.dto.APIResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setHeader("content-type", "application/json");
        ObjectMapper objectMapper = new ObjectMapper();

        APIError error = new APIError("401", authException.getMessage());
        APIResponse<Void> data = new APIResponse<>(
                "error",
                null,
                "Authentication required",
                error
        );
        response.getWriter().write(objectMapper.writeValueAsString(data));
        response.getWriter().flush();
        response.getWriter().close();
    }
}