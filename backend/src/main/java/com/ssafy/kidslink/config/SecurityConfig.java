package com.ssafy.kidslink.config;

import com.ssafy.kidslink.common.exception.CustomAuthenticationEntryPoint;
import com.ssafy.kidslink.common.jwt.CustomLogoutFilter;
import com.ssafy.kidslink.common.jwt.JWTAuthenticationFilter;
import com.ssafy.kidslink.common.jwt.JWTAuthorizationFilter;
import com.ssafy.kidslink.common.jwt.JWTUtil;
import com.ssafy.kidslink.common.oauth2.CustomOAuth2FailureHandler;
import com.ssafy.kidslink.common.oauth2.CustomOAuth2SuccessHandler;
import com.ssafy.kidslink.common.oauth2.CustomOAuth2UserService;
import com.ssafy.kidslink.common.security.CustomUserDetailsService;
import com.ssafy.kidslink.common.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.http.HttpMethod.POST;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {
    @Value("${spring.profiles.active}")
    private String activeProfile;
    @Value("${frontend.server.url}")
    private String frontendServerUrl;
    private final JWTUtil jwtUtil;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final RefreshTokenService refreshTokenService;

    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomOAuth2SuccessHandler customOAuth2SuccessHandler;
    private final CustomOAuth2FailureHandler customOAuth2FailureHandler;
    private final CustomUserDetailsService customUserDetailsService;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(corsConfigurer -> corsConfigurer.configurationSource(apiConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .headers(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .exceptionHandling((exceptions) -> exceptions
                        .authenticationEntryPoint(customAuthenticationEntryPoint))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2Login((oauth2) -> oauth2
                        .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
                                .userService(customOAuth2UserService))
                        .successHandler(customOAuth2SuccessHandler)
                        .failureHandler(customOAuth2FailureHandler))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/").permitAll()
                        .requestMatchers(POST, "/api/user/**").permitAll()
                        .anyRequest().permitAll())
                .addFilterAt(new JWTAuthenticationFilter(authenticationManager(authenticationConfiguration), jwtUtil, refreshTokenService), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new JWTAuthorizationFilter(jwtUtil, customUserDetailsService), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new CustomLogoutFilter(jwtUtil, refreshTokenService), LogoutFilter.class);

        if (isOAuth2Configured()) {
            http.oauth2Login(oauth2 -> oauth2
                    .userInfoEndpoint(userInfoEndpointConfig -> userInfoEndpointConfig
                            .userService(customOAuth2UserService))
                    .successHandler(customOAuth2SuccessHandler)
                    .failureHandler(customOAuth2FailureHandler));
        }

        return http.build();
    }

    private CorsConfigurationSource apiConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(frontendServerUrl));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(86400L);
        configuration.setExposedHeaders(List.of("Authorization", "Set-Cookie"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    private boolean isOAuth2Configured() {
        return !System.getenv().getOrDefault("OAUTH2_NAVER_CLIENT_ID", "").isEmpty() &&
                !System.getenv().getOrDefault("OAUTH2_NAVER_CLIENT_SECRET", "").isEmpty() &&
                !System.getenv().getOrDefault("OAUTH2_GOOGLE_CLIENT_ID", "").isEmpty() &&
                !System.getenv().getOrDefault("OAUTH2_GOOGLE_CLIENT_SECRET", "").isEmpty();
    }

}
