package com.ssafy.kidslink.application.teacher.controller;

import com.ssafy.kidslink.application.teacher.dto.JoinDTO;
import com.ssafy.kidslink.application.teacher.dto.TeacherDTO;
import com.ssafy.kidslink.application.teacher.service.TeacherService;
import com.ssafy.kidslink.common.dto.APIError;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<APIResponse<TeacherDTO>> getProcess(@AuthenticationPrincipal Object principal) {

        if (principal instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;

            TeacherDTO teacherDTO = teacherService.detailProcess(userDetails.getUsername());
            APIResponse<TeacherDTO> responseData = new APIResponse<>(
                    "success",
                    teacherDTO,
                    "선생님의 정보를 성공적으로 조회했습니다.",
                    null
            );
            return new ResponseEntity<>(responseData, HttpStatus.OK);

        }
        APIError apiError = new APIError("UNAUTHORIZED", "유효한 JWT 토큰이 필요합니다.");

        APIResponse<TeacherDTO> responseData = new APIResponse<>(
                "success",
                null,
                "선생님의 정보 조회를 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }
}
