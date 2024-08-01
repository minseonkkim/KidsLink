package com.ssafy.kidslink.application.schedule.controller;

import com.ssafy.kidslink.application.schedule.dto.AllParentScheduleDTO;
import com.ssafy.kidslink.application.schedule.dto.AllTeacherScheduleDTO;
import com.ssafy.kidslink.application.schedule.dto.TeacherScheduleDTO;
import com.ssafy.kidslink.application.schedule.service.ScheduleService;
import com.ssafy.kidslink.common.dto.APIError;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.exception.InvalidPrincipalException;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(summary = "선생님 일정 조회", description = "선생님의 특정 일자별 일정을 조회합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string")),
                    @Parameter(name = "date", description = "조회할 날짜 (yyyy-MM-dd 형식)", required = true, schema = @Schema(type = "string"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "일정 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "요청 실패",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "401", description = "유효한 JWT 토큰 필요",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
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
                "fail",
                null,
                "선생님 일자별 일정 조회에 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }




    @Operation(summary = "부모님 월별 일정 조회", description = "부모님의 특정 월별 일정을 조회합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string")),
                    @Parameter(name = "year", description = "조회할 연도", required = true, schema = @Schema(type = "integer")),
                    @Parameter(name = "month", description = "조회할 월", required = true, schema = @Schema(type = "integer"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "일정 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "요청 실패",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "401", description = "유효한 JWT 토큰 필요",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @GetMapping("/parent")
    public ResponseEntity<APIResponse<List<LocalDate>>> getParentSchedule(@AuthenticationPrincipal Object principal,
                                                                        @RequestParam(value = "year", required = true)int year,
                                                                        @RequestParam(value = "month", required = true)int month) {
        if(principal instanceof CustomUserDetails){
            CustomUserDetails userDetails = (CustomUserDetails) principal;
            List<LocalDate> schedules = scheduleService.getParentSchedules(userDetails.getUsername(),year, month);
            APIResponse<List<LocalDate>> responseData = new APIResponse<>(
                    "success",
                    schedules,
                    "부모 일정 조회에 성공하였습니다.",
                    null
            );
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        APIError apiError = new APIError("UNAUTHORIZED", "유효한 JWT 토큰이 필요합니다.");

        APIResponse<List<LocalDate>> responseData = new APIResponse<>(
                "fail",
                null,
                "부모 일정 조회에 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }




    @Operation(summary = "부모님 일자별 일정 상세 조회", description = "부모님의 특정 일자별 상세 일정을 조회합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string")),
                    @Parameter(name = "date", description = "조회할 날짜 (yyyy-MM-dd 형식)", required = true, schema = @Schema(type = "string"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "일정 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "요청 실패",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "401", description = "유효한 JWT 토큰 필요",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    // 부모님 일자별 일정 상세 조회
    @GetMapping("/parent/detail")
    public ResponseEntity<APIResponse<AllParentScheduleDTO>> getParentDetailSchedules(@AuthenticationPrincipal Object principal,
                                                                                         @RequestParam(value="date", required = true)String date) {
        if(principal instanceof CustomUserDetails){
            CustomUserDetails userDetails = (CustomUserDetails) principal;
            AllParentScheduleDTO schedules = scheduleService.getParentDetailSchedules(userDetails.getUsername(),LocalDate.parse(date));
            APIResponse<AllParentScheduleDTO> responseData = new APIResponse<>(
                    "success",
                    schedules,
                    "부모 일자별 일정 조회에 성공하였습니다.",
                    null
            );
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        APIError apiError = new APIError("UNAUTHORIZED", "유효한 JWT 토큰이 필요합니다.");

        APIResponse<AllParentScheduleDTO> responseData = new APIResponse<>(
                "fail",
                null,
                "부모 일자별 일정 조회에 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }


    @Operation(summary = "일정 등록", description = "선생님 일정을 등록합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "일정 등록 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "요청 실패",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "401", description = "유효한 JWT 토큰 필요",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
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
                "fail",
                null,
                "일정 등록을 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/teacher/{teacherScheduleId}/check")
    public ResponseEntity<APIResponse<Void>> teacherCheckSchedule(@AuthenticationPrincipal Object principal, @PathVariable int teacherScheduleId){
        if(principal instanceof CustomUserDetails userDetails){
            scheduleService.changeStatusTeacherSchedule(teacherScheduleId);
            APIResponse<Void> responseData = new APIResponse<>(
                    "success",
                    null,
                    "상태 변경 성공",
                    null
            );
            return ResponseEntity.status(HttpStatus.OK).body(responseData);
        }
        throw new InvalidPrincipalException("Invalid principal type");
    }

    @DeleteMapping("/teacher/{teacherScheduleId}")
    public ResponseEntity<APIResponse<Void>> deleteTeacherSchedule(@AuthenticationPrincipal Object principal, @PathVariable int teacherScheduleId){
        if(principal instanceof CustomUserDetails userDetails){
            scheduleService.deleteTeacherSchedule(teacherScheduleId);
            APIResponse<Void> responseData = new APIResponse<>(
                    "success",
                    null,
                    "일정 삭제 성공",
                    null
            );
            return ResponseEntity.status(HttpStatus.OK).body(responseData);
        }
        throw new InvalidPrincipalException("Invalid principal type");
    }
}
