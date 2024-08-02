package com.ssafy.kidslink.common.service;

import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;

    public boolean isExistUser(String username) {
        return teacherRepository.existsByTeacherUsername(username) || parentRepository.existsByParentUsername(username);
    }

    public boolean isExistByUsernameForTeacher(String username) {
        return teacherRepository.existsByTeacherUsername(username);
    }

    public Map<String, Object> getOAuth2Info(HttpSession httpSession) {
        log.info("Fetching OAuth2 info from session");
        Map<String, Object> map = new HashMap<>();
        OAuth2User oauth2User = (OAuth2User) httpSession.getAttribute("oauth2User");
        String registrationId = (String) httpSession.getAttribute("registrationId");
        String username = (String) httpSession.getAttribute("username");
        String email = (String) httpSession.getAttribute("email");
        map.put("oauth2User", oauth2User);
        map.put("registrationId", registrationId);
        map.put("username", username);
        map.put("email", email);
        log.info("Stored OAuth2 info: oauth2User={}, registrationId={}, username={}, email={}", oauth2User, registrationId, username, email);
        return map;
    }
}
