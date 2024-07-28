package com.ssafy.kidslink.common.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.common.dto.APIError;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.dto.LoginDTO;
import com.ssafy.kidslink.common.redis.RefreshToken;
import com.ssafy.kidslink.common.repository.RefreshTokenRepository;
import com.ssafy.kidslink.common.service.RefreshTokenService;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import static com.ssafy.kidslink.common.util.CookieUtil.createCookie;

/**
 * TODO #1 Refresh Repository 추가
 */
@Slf4j
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    public JWTAuthenticationFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, RefreshTokenService refreshTokenService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
        setFilterProcessesUrl("/api/user/login");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        log.debug("JwtAuthenticationTokenFilter.doFilter");
        super.doFilter(request, response, chain);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        log.debug("JwtAuthenticationTokenFilter.attemptAuthentication");
        LoginDTO loginDTO;

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ServletInputStream inputStream = request.getInputStream();
            String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
            loginDTO = objectMapper.readValue(messageBody, LoginDTO.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        String username = loginDTO.getUsername();
        String password = loginDTO.getPassword();

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password);

        return authenticationManager.authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        log.debug("JwtAuthenticationTokenFilter.successfulAuthentication");
        String username = authResult.getName();

        Collection<? extends GrantedAuthority> collection = authResult.getAuthorities();
        Iterator<? extends GrantedAuthority> it = collection.iterator();
        GrantedAuthority auth = it.next();
        String role = auth.getAuthority();

        JWTTokenDTO jwtToken = new JWTTokenDTO();
        jwtToken.setAccess(jwtUtil.createJwt("access", false, username, role, JWTUtil.ACCESS_TOKEN_VALIDITY_SECONDS));
        jwtToken.setRefresh(jwtUtil.createJwt("refresh", false, username, role, JWTUtil.REFRESH_TOKEN_VALIDITY_SECONDS));

        String access = jwtToken.getAccess();
        String refresh = jwtToken.getRefresh();

        // refresh save
        refreshTokenService.saveTokenInfo(username, access, refresh);

        response.setHeader("access", access);
        response.addCookie(createCookie("refresh", refresh));
        response.setStatus(HttpStatus.OK.value());

        HashMap<String, String> responseMap = new HashMap<>();
        responseMap.put("role", role);
        responseMap.put("token", access);
        responseMap.put("expiredAt", String.valueOf(System.currentTimeMillis() + JWTUtil.ACCESS_TOKEN_VALIDITY_SECONDS));

        // 필요한 경우 response body를 추가
        APIResponse<Map<String, String>> responseData = new APIResponse<>(
                "success",
                responseMap,
                "로그인에 성공했습니다.",
                null
        );

        ObjectMapper objectMapper = new ObjectMapper();
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(responseData));
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        log.debug("JwtAuthenticationTokenFilter.unsuccessfulAuthentication");
        handleException(response, "유효한 JWT 토큰 필요", "UNAUTHORIZED_ERROR", HttpServletResponse.SC_UNAUTHORIZED);
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
