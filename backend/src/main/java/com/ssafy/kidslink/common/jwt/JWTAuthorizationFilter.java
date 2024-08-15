package com.ssafy.kidslink.common.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.kidslink.common.dto.APIError;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.dto.User;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import com.ssafy.kidslink.common.security.CustomUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;

@Slf4j
@RequiredArgsConstructor
public class JWTAuthorizationFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.debug("JWT Authorization Filter");
        String authorization = request.getHeader("Authorization");
        String token = null;
        if(authorization != null && authorization.startsWith("Bearer ")) {
            token = authorization.substring(7);
        }

        // token null case
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            jwtUtil.isExpired(token);
        } catch (ExpiredJwtException e) {
            handleException(response, "ACCESS 토큰 만료", "AUTHENTICATION_ERROR", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // token category confirm
        String category = jwtUtil.getCategory(token);

        if (!"access".equals(category)) {
            filterChain.doFilter(request, response);
            return;
        }

        // token get username and role
        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);

        if (jwtUtil.isOAuth2(token)) {
            User user = new User();
            user.setUsername(username);
            user.setRole(role);
            CustomUserDetails userDetails = new CustomUserDetails(user, null);

            //스프링 시큐리티 인증 토큰 생성
            Authentication authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            //세션에 사용자 등록
            SecurityContextHolder.getContext().setAuthentication(authToken);
        } else {
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
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
}
