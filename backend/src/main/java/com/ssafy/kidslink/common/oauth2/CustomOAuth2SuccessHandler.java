package com.ssafy.kidslink.common.oauth2;

import com.ssafy.kidslink.common.jwt.JWTTokenDTO;
import com.ssafy.kidslink.common.jwt.JWTUtil;
import com.ssafy.kidslink.common.redis.RefreshToken;
import com.ssafy.kidslink.common.repository.RefreshTokenRepository;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import com.ssafy.kidslink.common.service.RefreshTokenService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.ssafy.kidslink.common.util.CookieUtil.createCookie;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${frontend.server.url}")
    private String frontendServerUrl;
    private final HttpSession httpSession;

    public final String REDIRECT_URI_PARAM = frontendServerUrl;

    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.debug("CustomSuccessHandler.onAuthenticationSuccess");

        //OAuth2User
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        if (customUserDetails.getAuthorities().iterator().next().getAuthority().equals("ROLE_GUEST")) {
            log.debug("OAuth2 Join Redirect");
            notJoinOAuth2(response, authentication);
            return;
        }

        String username = customUserDetails.getUsername();

        String role = customUserDetails
                .getAuthorities()
                .stream()
                .findFirst()
                .orElseThrow(IllegalAccessError::new)
                .getAuthority();

        JWTTokenDTO jwtToken = new JWTTokenDTO();
        jwtToken.setAccess(jwtUtil.createJwt("access", true, username, role, 1000 * 60 * 10L));
        jwtToken.setRefresh(jwtUtil.createJwt("refresh", true, username, role, 1000 * 60 * 60 * 24L));

        String access = jwtToken.getAccess();
        String refresh = jwtToken.getRefresh();

        response.setHeader("access", access);
        response.addCookie(createCookie("refresh", refresh));
        addRefreshToken(username, access, refresh);

        Optional<Cookie> oCookie = Arrays.stream(request.getCookies()).filter(cookie -> cookie.getName().equals(REDIRECT_URI_PARAM)).findFirst();
        Optional<String> redirectUri = oCookie.map(Cookie::getValue);

        log.debug("OAuth2 Login Success access - {}, refresh - {}", access, refresh);

        response.sendRedirect(redirectUri.orElseGet(() -> frontendServerUrl)
                + "/social/login"
                + "?accessToken=" + URLEncoder.encode(access, StandardCharsets.UTF_8.toString())
                + "&expiredAt=" + (System.currentTimeMillis() + JWTUtil.ACCESS_TOKEN_VALIDITY_SECONDS)
                + "&role=" + URLEncoder.encode(role, StandardCharsets.UTF_8.toString()));
    }

    private void notJoinOAuth2(HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String registrationId = (String) httpSession.getAttribute("registrationId");
        String username = (String) httpSession.getAttribute("username");
        String email = (String) httpSession.getAttribute("email");

        // 로그인 성공 후 프론트엔드로 리다이렉트
        String redirectUrl = String.format("%s/social/join?registrationId=%s&username=%s&email=%s", frontendServerUrl, registrationId, username, email);
        response.sendRedirect(redirectUrl);
    }

    private void addRefreshToken(String username, String access, String refresh) {
        refreshTokenService.saveTokenInfo(username, access, refresh);
    }
}
