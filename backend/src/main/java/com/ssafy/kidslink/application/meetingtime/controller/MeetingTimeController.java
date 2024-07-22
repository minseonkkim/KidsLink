package com.ssafy.kidslink.application.meetingtime.controller;

import com.ssafy.kidslink.application.meetingtime.dto.OpenMeetingTimeDTO;
import com.ssafy.kidslink.application.meetingtime.service.MeetingTimeService;
import com.ssafy.kidslink.common.dto.APIError;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/meeting")
@RequiredArgsConstructor
@Slf4j
public class MeetingTimeController {
    private final MeetingTimeService meetingTimeService;

    @PostMapping("/open")
    public ResponseEntity<APIResponse<Void>> openMeetingTimes(@AuthenticationPrincipal Object principal, @RequestBody List<OpenMeetingTimeDTO> requestDTOs){
        if(principal instanceof CustomUserDetails){
            CustomUserDetails userDetails = (CustomUserDetails) principal;

            meetingTimeService.openMeetingTimes(userDetails.getUsername(), requestDTOs);
            APIResponse<Void> responseData = new APIResponse<>(
                    "success",
                    null,
                    "상담 일정 오픈에 성공하였습니다.",
                    null
            );
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        APIError apiError = new APIError("UNAUTHORIZED", "유효한 JWT 토큰이 필요합니다.");

        APIResponse<Void> responseData = new APIResponse<>(
                "success",
                null,
                "상담 일정 오픈을 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }
}

