package com.ssafy.kidslink.application.teacher.controller;

import com.ssafy.kidslink.application.kindergarten.dto.ResponseClassInfoDTO;
import com.ssafy.kidslink.application.kindergarten.service.KindergartenService;
import com.ssafy.kidslink.application.teacher.dto.TeacherJoinDTO;
import com.ssafy.kidslink.application.teacher.dto.TeacherDTO;
import com.ssafy.kidslink.application.teacher.service.TeacherService;
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

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
@Slf4j
public class TeacherController {
    private final TeacherService teacherService;
    private final KindergartenService kindergartenService;



    @Operation(summary = "선생님 회원 가입", description = "선생님 회원 가입을 처리합니다.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "선생님 회원 가입 요청 데이터",
                    content = @Content(mediaType = "application/x-www-form-urlencoded",
                            schema = @Schema(implementation = TeacherJoinDTO.class))
            ))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "선생님 회원 가입 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "유효하지 않은 요청",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @PostMapping("")
    public ResponseEntity<APIResponse<Void>> joinProcess(@ModelAttribute TeacherJoinDTO joinDTO) {
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




    @Operation(summary = "선생님 정보 조회", description = "선생님의 정보를 조회합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "선생님 정보 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "유효하지 않은 JWT 토큰",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @GetMapping("")
    public ResponseEntity<APIResponse<TeacherDTO>> getProcess(@AuthenticationPrincipal Object principal) {
        if (principal instanceof CustomUserDetails userDetails) {
            TeacherDTO teacherDTO = teacherService.getDetailByUsername(userDetails.getUsername());
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




    @Operation(summary = "우리반 정보 조회", description = "현재 담당하고 있는 반의 정보를 조회합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "우리반 정보 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "유효하지 않은 JWT 토큰",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
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
