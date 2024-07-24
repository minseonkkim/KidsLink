package com.ssafy.kidslink.common.service;

import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;

    public boolean isExistUser(String username) {
        return teacherRepository.existsByTeacherUsername(username) && parentRepository.existsByParentUsername(username);
    }

    public boolean isExistByUsernameForTeacher(String username) {
        return teacherRepository.existsByTeacherUsername(username);
    }

}
