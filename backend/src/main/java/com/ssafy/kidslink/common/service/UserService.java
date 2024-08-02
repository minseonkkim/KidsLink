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
}
