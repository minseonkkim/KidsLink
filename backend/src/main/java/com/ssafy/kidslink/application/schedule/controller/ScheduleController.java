package com.ssafy.kidslink.application.schedule.controller;

import com.ssafy.kidslink.application.schedule.dto.AllTeacherScheduleDTO;
import com.ssafy.kidslink.application.schedule.dto.KindergartenScheduleDTO;
import com.ssafy.kidslink.application.schedule.dto.TeacherScheduleDTO;
import com.ssafy.kidslink.application.schedule.service.ScheduleService;
import com.ssafy.kidslink.common.dto.APIError;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
@Slf4j
public class ScheduleController {
    private final ScheduleService scheduleService;

    // 일자별 선생님 일정 전체 조회
    @GetMapping("/teacher")
    public ResponseEntity<APIResponse<AllTeacherScheduleDTO>> getTeacherSchedule(@AuthenticationPrincipal Object principal,
                                                                                 @RequestParam(value="date", required = true)String date) {
        if(principal instanceof CustomUserDetails){
            CustomUserDetails userDetails = (CustomUserDetails) principal;
            AllTeacherScheduleDTO schedules = scheduleService.getTeacherSchedule(userDetails.getUsername(), LocalDate.parse(date));
            APIResponse<AllTeacherScheduleDTO> responseData = new APIResponse<>(
                    "success",
                    schedules,
                    "선생님 일자별 일정 조회에 성공하였습니다.",
                    null
            );
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        APIError apiError = new APIError("UNAUTHORIZED", "유효한 JWT 토큰이 필요합니다.");

        APIResponse<AllTeacherScheduleDTO> responseData = new APIResponse<>(
                "success",
                null,
                "선생님 일자별 일정 조회에 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }


    @GetMapping("/parent")
    public ResponseEntity<APIResponse<List<KindergartenScheduleDTO>>> getParentSchedules(@AuthenticationPrincipal Object principal) {
        if(principal instanceof CustomUserDetails){
            CustomUserDetails userDetails = (CustomUserDetails) principal;
            List<KindergartenScheduleDTO> schedules = scheduleService.getParentSchedules(userDetails.getUsername());
            APIResponse<List<KindergartenScheduleDTO>> responseData = new APIResponse<>(
                    "success",
                    schedules,
                    "학사 일정 조회에 성공하였습니다.",
                    null
            );
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        APIError apiError = new APIError("UNAUTHORIZED", "유효한 JWT 토큰이 필요합니다.");

        APIResponse<List<KindergartenScheduleDTO>> responseData = new APIResponse<>(
                "success",
                null,
                "학사 일정 조회에 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/teacher")
    public ResponseEntity<APIResponse<Void>> addSchedule(@AuthenticationPrincipal Object principal, @RequestBody TeacherScheduleDTO requestDTO){
        if(principal instanceof CustomUserDetails){
            CustomUserDetails userDetails = (CustomUserDetails) principal;

            scheduleService.addSchedule(userDetails.getUsername(), requestDTO);
            APIResponse<Void> responseData = new APIResponse<>(
                    "success",
                    null,
                    "일정 등록에 성공하였습니다.",
                    null
            );
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        APIError apiError = new APIError("UNAUTHORIZED", "유효한 JWT 토큰이 필요합니다.");

        APIResponse<Void> responseData = new APIResponse<>(
                "success",
                null,
                "일정 등록을 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }
}
