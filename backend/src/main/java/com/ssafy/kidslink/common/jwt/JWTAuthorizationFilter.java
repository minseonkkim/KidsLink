package com.ssafy.kidslink.common.jwt;

import com.ssafy.kidslink.common.security.CustomUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
        log.info("JWT Authorization Filter");
        String authorization = request.getHeader("Authorization");
        String token = null;
        if(authorization != null && authorization.startsWith("Bearer ")) {
            token = authorization.substring(7);
        }
        log.info("token 1 - {}", token);

        // token null case
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        log.info("token 2 - {}", token);

        try {
            jwtUtil.isExpired(token);
        } catch (ExpiredJwtException e) {
            PrintWriter writer = response.getWriter();

            writer.print("access token expired");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // token category confirm
        String category = jwtUtil.getCategory(token);

        log.info("category - {}", category);

        if (!"access".equals(category)) {
            filterChain.doFilter(request, response);
            return;
        }

        // token get username and role
        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);

        if (jwtUtil.isOAuth2(token)) {
            // OAuth2 Login Logic
        } else {
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.info("user - {}", userDetails.getUsername());
        }
        filterChain.doFilter(request, response);
    }
}
