package com.ssafy.kidslink.common.service;

import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final TeacherRepository teacherRepository;

    public boolean isExistByUsernameForTeacher(String username) {
        return teacherRepository.existsByTeacherUsername(username);
    }

}
