package com.ssafy.kidslink.common.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.kidslink.common.dto.APIError;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.exception.JWTAuthenticationException;
import com.ssafy.kidslink.common.service.RefreshTokenService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;

/**
 * TODO #1 Refresh Token 삭제 로직 추가
 * TODO #2 Refresh Token Redis 관리 전략
 */
@RequiredArgsConstructor
public class CustomLogoutFilter extends GenericFilterBean {
    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        // path and method verify
        String requestUri = request.getRequestURI();
        String requestMethod = request.getMethod();

        if (!requestUri.matches("^.*\\/logout$")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (!requestMethod.equals("POST")) {
            filterChain.doFilter(request, response);
            return;
        }

        // get refresh token
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refresh")) {
                    refresh = cookie.getValue();
                }
            }
        }

        // refresh null check
        if (refresh == null) {
            handleException(response, "Refresh token not found", "400", HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // expired check
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            // response status code
            handleException(response, "Refresh token expired", "400", HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // refresh Token Category confirm
        String category = jwtUtil.getCategory(refresh);
        if (!category.equals("refresh")) {
            handleException(response, "Invalid token category", "400", HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // refresh Token DB Check
//        if (!refreshTokenService.existsByRefresh(refresh)) {
//            handleException(response, "Token not found in database", "400", HttpServletResponse.SC_BAD_REQUEST);
//            return;
//        }

        // logout process
        // refresh Token Remove
        try {
            refreshTokenService.removeRefreshToken(refresh);
        } catch (JWTAuthenticationException e) {
            handleException(response, e.getMessage(), "401", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (Exception e) {
            handleException(response, e.getMessage(), "400", HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // Refresh Token Cookie Remove
        Cookie cookie = new Cookie("refresh", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // 로컬 환경에서는 Secure 속성 사용하지 않음
        response.addCookie(cookie);

        // SameSite=Lax 속성 추가
        response.addHeader("Set-Cookie", "refresh=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax");

        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

        handleSuccess(response, "Logout successful");
    }

    private void handleException(HttpServletResponse response, String message, String code, int status) throws IOException {
        APIError apiError = new APIError(code, message);
        APIResponse<Void> responseData = new APIResponse<>(
                "fail",
                null,
                message,
                apiError
        );

        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        PrintWriter writer = response.getWriter();
        ObjectMapper objectMapper = new ObjectMapper();
        writer.write(objectMapper.writeValueAsString(responseData));
        writer.flush();
    }

    private void handleSuccess(HttpServletResponse response, String message) throws IOException {
        APIResponse<Void> responseData = new APIResponse<>(
                "success",
                null,
                message,
                null
        );

        response.setStatus(HttpServletResponse.SC_ACCEPTED);
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        PrintWriter writer = response.getWriter();
        ObjectMapper objectMapper = new ObjectMapper();
        writer.write(objectMapper.writeValueAsString(responseData));
        writer.flush();
    }
}