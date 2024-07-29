package com.ssafy.kidslink.application.diary.controller;

import com.ssafy.kidslink.application.diary.dto.DiaryDTO;
import com.ssafy.kidslink.application.diary.dto.DiaryRequestDTO;
import com.ssafy.kidslink.application.diary.service.DiaryService;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.exception.InvalidPrincipalException;
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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diary")
@RequiredArgsConstructor
@Slf4j
public class DiaryController {

    private final DiaryService diaryService;


    @Operation(summary = "성장일지 작성", description = "지정된 자녀에 대해 성장일지를 작성합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string")),
                    @Parameter(name = "childId", description = "자녀 ID", required = true, in = ParameterIn.PATH, schema = @Schema(type = "integer"))
            },
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "성장일지 작성 요청 데이터",
                    content = @Content(mediaType = "multipart/form-data",
                            schema = @Schema(implementation = DiaryRequestDTO.class))
            ))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성장일지 작성 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "유효하지 않은 요청",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @PostMapping("/child/{childId}")
    public ResponseEntity<APIResponse<Void>> createDiary(@AuthenticationPrincipal Object principal, @PathVariable("childId") int childId, @ModelAttribute DiaryRequestDTO request) {
        if(principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            String teacherUsername = userDetails.getUsername();
            diaryService.createDiary(childId, teacherUsername, request);
            APIResponse<Void> responseData = new APIResponse<>(
                    "success",
                    null,
                    "성장일지가 성공적으로 작성되었습니다.",
                    null
            );
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        throw new InvalidPrincipalException("Invalid principal type.");
    }


    @Operation(summary = "성장일지 조회", description = "지정된 자녀의 모든 성장일지를 조회합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string")),
                    @Parameter(name = "childId", description = "자녀 ID", required = true, in = ParameterIn.PATH, schema = @Schema(type = "integer"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성장일지 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "유효하지 않은 요청",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @GetMapping("/child/{childId}")
    public ResponseEntity<APIResponse<List<DiaryDTO>>> getAllDiary(@AuthenticationPrincipal Object principal, @PathVariable("childId") int childId) {
        if(principal instanceof UserDetails) {
            List<DiaryDTO> diaries = diaryService.getAllDiary(childId);
            APIResponse<List<DiaryDTO>> responseData = new APIResponse<>(
                    "success",
                    diaries,
                    "성장일지를 성공적으로 조회했습니다.",
                    null
            );
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        throw new InvalidPrincipalException("Invalid principal type.");
    }




    @Operation(summary = "성장일지 상세 조회", description = "지정된 ID의 성장일지를 조회합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string")),
                    @Parameter(name = "diaryId", description = "성장일지 ID", required = true, in = ParameterIn.PATH, schema = @Schema(type = "integer"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성장일지 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "유효하지 않은 요청",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @GetMapping("{diaryId}")
    public ResponseEntity<APIResponse<DiaryDTO>> getDiary(@AuthenticationPrincipal Object principal, @PathVariable("diaryId") int diaryId) {
        if(principal instanceof UserDetails) {
            DiaryDTO diary = diaryService.getDiary(diaryId);

            APIResponse<DiaryDTO> responseData = new APIResponse<>(
                    "success",
                    diary,
                    "성장일지를 성공적으로 조회했습니다.",
                    null
            );
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        throw new InvalidPrincipalException("Invalid principal type.");
    }

}
