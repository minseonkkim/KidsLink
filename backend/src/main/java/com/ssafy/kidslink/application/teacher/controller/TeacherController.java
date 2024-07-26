package com.ssafy.kidslink.application.teacher.controller;

import com.ssafy.kidslink.application.kindergarten.dto.ResponseClassInfoDTO;
import com.ssafy.kidslink.application.kindergarten.service.KindergartenService;
import com.ssafy.kidslink.application.teacher.dto.JoinDTO;
import com.ssafy.kidslink.application.teacher.dto.TeacherDTO;
import com.ssafy.kidslink.application.teacher.service.TeacherService;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.exception.InvalidPrincipalException;
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
    private final KindergartenService kindergartenService;

    @PostMapping("")
    public ResponseEntity<APIResponse<Void>> joinProcess(@ModelAttribute JoinDTO joinDTO) {
        log.debug("joinDTO : {}", joinDTO);
        teacherService.joinProcess(joinDTO);
        APIResponse<Void> responseData = new APIResponse<>(
                "success",
                null,
                "선생님 회원 가입 성공",
                null
        );

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<APIResponse<TeacherDTO>> getProcess(@AuthenticationPrincipal Object principal) {
        if (principal instanceof CustomUserDetails userDetails) {
            TeacherDTO teacherDTO = teacherService.detailProcess(userDetails.getUsername());
            APIResponse<TeacherDTO> responseData = new APIResponse<>(
                    "success",
                    teacherDTO,
                    "선생님의 정보를 성공적으로 조회했습니다.",
                    null
            );
            return new ResponseEntity<>(responseData, HttpStatus.OK);

        }
        throw new InvalidPrincipalException("Invalid user principal");
    }

    @GetMapping("/class")
    public ResponseEntity<APIResponse<ResponseClassInfoDTO>> getMyClassInfo(@AuthenticationPrincipal Object principal) {
        if (principal instanceof CustomUserDetails userDetails) {
            String teacherUsername = userDetails.getUsername();

            ResponseClassInfoDTO responseClassInfoDTO = teacherService.getMyClassInfo(teacherUsername);
            APIResponse<ResponseClassInfoDTO> responseData = new APIResponse<>(
                    "success",
                    responseClassInfoDTO,
                    "우리반 정보 조회 성공",
                    null
            );

            return ResponseEntity.status(HttpStatus.OK).body(responseData);
        }
        throw new InvalidPrincipalException("Invalid user principal");
    }
}
