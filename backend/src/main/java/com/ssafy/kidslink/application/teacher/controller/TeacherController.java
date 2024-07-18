package com.ssafy.kidslink.application.teacher.controller;

import com.ssafy.kidslink.application.teacher.dto.JoinDTO;
import com.ssafy.kidslink.application.teacher.service.TeacherService;
import com.ssafy.kidslink.common.dto.APIResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
@Slf4j
public class TeacherController {
    private final TeacherService teacherService;

    @PostMapping("")
    public ResponseEntity joinProcess(@RequestBody JoinDTO joinDTO) {
        log.info("joinDTO : {}", joinDTO);
        teacherService.joinProcess(joinDTO);
        APIResponse<Void> responseData = new APIResponse<>(
                "sucess",
                null,
                "선생님 회원 가입 성공",
                null
        );

        return new ResponseEntity<>(responseData, HttpStatus.OK);


    }
}
