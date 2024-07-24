package com.ssafy.kidslink.application.schedule.controller;

import com.ssafy.kidslink.application.schedule.dto.ScheduleDTO;
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

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
@Slf4j
public class ScheduleController {
    private final ScheduleService scheduleService;

    @GetMapping("")
    public ResponseEntity<APIResponse<List<ScheduleDTO>>> getSchedules(@AuthenticationPrincipal Object principal) {
        if(principal instanceof CustomUserDetails){
            CustomUserDetails userDetails = (CustomUserDetails) principal;
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            List<ScheduleDTO> schedules = scheduleService.getSchedules(role, userDetails.getUsername());
            APIResponse<List<ScheduleDTO>> responseData = new APIResponse<>(
                    "success",
                    schedules,
                    "학사 일정 조회에 성공하였습니다.",
                    null
            );
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        APIError apiError = new APIError("UNAUTHORIZED", "유효한 JWT 토큰이 필요합니다.");

        APIResponse<List<ScheduleDTO>> responseData = new APIResponse<>(
                "success",
                null,
                "학사 일정 조회에 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }

    @PostMapping
    public ResponseEntity<APIResponse<Void>> addSchedule(@AuthenticationPrincipal Object principal, @RequestBody ScheduleDTO requestDTO){
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
