package com.ssafy.kidslink.common.oauth2;

import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import com.ssafy.kidslink.common.dto.User;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import com.ssafy.kidslink.common.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final UserService userService;
    private final HttpSession httpSession;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.debug("CustomOAuth2UserService.loadUser");
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        OAuth2Response oAuth2Response = null;
        log.debug("OAuth2 Response - {}", oAuth2User.getAttributes());

        if (registrationId.equals("naver")) {
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        }
        else if (registrationId.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else if (registrationId.equals("kakao")) {
            oAuth2Response = new KaKaoResponse(oAuth2User.getAttributes());
        } else {
            throw new OAuth2AuthenticationException("Unsupported provider: " + registrationId);
        }

        // parentService와 teacherService를 통해 유저 정보를 확인
        String username = oAuth2Response.getProvider() + ":" + oAuth2Response.getProviderId();
        boolean existsUser = userService.isExistUser(username);

        log.debug("username - {}", username);
        // 이미 소셜 로그인을 진행한 회원의 경우 로그인 진행
        if (existsUser) {
            User user = new User();
            user.setUsername(username);
            String role;
            String name;
            String email;
            if (userService.isExistByUsernameForTeacher(username)) {
                role = "ROLE_TEACHER";
                Teacher teacher = teacherRepository.findByTeacherUsername(username);
                name = teacher.getTeacherName();
                email = teacher.getTeacherEmail();
            } else {
                role = "ROLE_PARENT";
                Parent parent = parentRepository.findByParentUsername(username);
                name = parent.getParentName();
                email = parent.getParentEmail();
            }
            user.setRole(role);
            user.setName(name);
            user.setEmail(email);
            return new CustomUserDetails(user, oAuth2User.getAttributes());
        }
        else {
            httpSession.setAttribute("registrationId", registrationId);
            httpSession.setAttribute("username", username);
            httpSession.setAttribute("email", oAuth2Response.getEmail());
            User user = new User();
            user.setUsername(username);
            user.setEmail(oAuth2Response.getEmail());
            user.setRole("ROLE_GUEST");
            return new CustomUserDetails(user, oAuth2User.getAttributes());
        }
    }
}
