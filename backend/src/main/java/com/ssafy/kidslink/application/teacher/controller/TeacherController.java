package com.ssafy.kidslink.application.teacher.controller;

import com.ssafy.kidslink.application.teacher.dto.JoinDTO;
import com.ssafy.kidslink.application.teacher.dto.TeacherDTO;
import com.ssafy.kidslink.application.teacher.service.TeacherService;
import com.ssafy.kidslink.common.dto.APIResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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

    @GetMapping("")
    public ResponseEntity detailProcess(@RequestHeader("Authorization") String token){
        TeacherDTO teacherDTO = teacherService.detailProcess(token);
        Map<String, Object> response = new HashMap<>();
        if(teacherDTO != null) {
            response.put("status", "success");
            response.put("messagae", "선생님 회원 정보 조회 성공");
            response.put("data", teacherDTO);
            response.put("error", null);
        }else{
            response.put("status", "error");
            response.put("message","요청한 알림장을 찾을 수 없습니다.");
            response.put("data", null);
            response.put("error","NOT_FOUND");
        }
        return ResponseEntity.ok(response);
    }
}
