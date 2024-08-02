package com.ssafy.kidslink.common.oauth2;

import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import com.ssafy.kidslink.common.dto.User;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import com.ssafy.kidslink.common.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.security.core.AuthenticationException;

import java.io.IOException;

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
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        OAuth2Response oAuth2Response = null;
        log.info("OAuth2 Response - {}", oAuth2User.getAttributes());
        if (registrationId.equals("naver")) {
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        }
        else if (registrationId.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        }
        else {
            throw new OAuth2AuthenticationException("Unsupported provider: " + registrationId);
        }

        // parentService와 teacherService를 통해 유저 정보를 확인
        String username = oAuth2Response.getProvider() + ":" + oAuth2Response.getProviderId();
        boolean existsUser = userService.isExistUser(username);

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
            // ********** COMMENT 관련 후에 삭제 **********
            // 처음 소셜 로그인을 접근한 경우
            // 회원가입을 따로 진행해야함.
            // 또한 소셜로그인 이후 ROLE 도 받아와야 함.
            /**
             * ROLE_TEACHER CASE
             * 선생님 : 프로필(MultiPartFile profile),이름(String name), 닉네임(String nickname), 폰번호(tel), 유치원PK(int kindergartenId), 유치원반PK(int kindergartenClassId)
             */
            /**
             * ROLE_PARENT CASE
             * 학부모 : 이름(String name), 닉네임(String nickname), 폰번호(String tel), 자녀정보(JoinChildDTO child), 프로필(MultiPartFile profile), 자녀 프로필(MultiPartFile childProfile)
             */
            // 이후 각각 JoinParentDTO 또는 JoinTeacherDTO를 만들어서 각각의 컨트롤러에서 회원가입 예정
            // 이후 소셜 로그인 시 해당 로그인 정보를 불러오고, 만약 회원가입 중 실패했다면 다시 회원가입을 진행해야함.
            // ********** COMMENT 관련 후에 삭제 **********
            // 새로운 사용자일 경우, 세션에 정보를 저장
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
