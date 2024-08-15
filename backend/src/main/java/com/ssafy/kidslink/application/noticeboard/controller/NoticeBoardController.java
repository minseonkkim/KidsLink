package com.ssafy.kidslink.application.noticeboard.controller;

import com.ssafy.kidslink.application.noticeboard.dto.NoticeBoardDTO;
import com.ssafy.kidslink.application.noticeboard.dto.NoticeBoardRequestDTO;
import com.ssafy.kidslink.application.noticeboard.service.NoticeBoardService;
import com.ssafy.kidslink.common.dto.APIError;
import com.ssafy.kidslink.common.dto.APIResponse;
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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;

@RestController
@RequestMapping("/api/noticeboard")
@RequiredArgsConstructor
@Slf4j
public class NoticeBoardController {
    private final NoticeBoardService noticeBoardService;

    @Operation(summary = "알림장 목록 조회", description = "모든 알림장을 조회합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "알림장 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "알림장 조회 실패",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @GetMapping
    public ResponseEntity<APIResponse<List<NoticeBoardDTO>>> getNoticeBoards(@Parameter(hidden = true) @AuthenticationPrincipal Object principal) {
        if (principal instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;

            Collection<? extends GrantedAuthority> collection = userDetails.getAuthorities();
            Iterator<? extends GrantedAuthority> it = collection.iterator();
            GrantedAuthority auth = it.next();
            String role = auth.getAuthority();

            List<NoticeBoardDTO> noticeBoards = noticeBoardService.getAllNoticeBoards(role, userDetails.getUsername());
            APIResponse<List<NoticeBoardDTO>> responseData = new APIResponse<>(
                    "success",
                    noticeBoards,
                    "알림장 조회에 성공하였습니다.",
                    null
            );

            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        APIError apiError = new APIError("UNAUTHORIZED", "유효한 JWT 토큰이 필요합니다.");

        APIResponse<List<NoticeBoardDTO>> responseData = new APIResponse<>(
                "success",
                null,
                "알림장 조회에 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);

    }

    @Operation(summary = "알림장 상세 조회", description = "알림장 ID를 통해 알림장 상세 정보를 조회합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "알림장 상세 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "404", description = "알림장 찾을 수 없음",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<NoticeBoardDTO>> getNoticeBoardDetail(@Parameter(description = "알림장 ID") @PathVariable int id) {
        NoticeBoardDTO noticeBoardDTO = noticeBoardService.getNoticeBoardDetail(id);
        APIResponse<NoticeBoardDTO> responseData = new APIResponse<>(
                "success",
                noticeBoardDTO,
                "알림장 상세 조회에 성공하였습니다.",
                null
        );

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @Operation(summary = "알림장 작성", description = "새로운 알림장을 작성합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "알림장 작성 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "인증 실패",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @PostMapping
    public ResponseEntity<APIResponse<Void>> createNoticeBoard(@Parameter(hidden = true) @AuthenticationPrincipal Object principal,
                                                               @RequestBody NoticeBoardRequestDTO requestDto) {
        if (principal instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;

            noticeBoardService.createNoticeBoard(userDetails.getUsername(), requestDto);
            APIResponse<Void> responseData = new APIResponse<>(
                    "success",
                    null,
                    "알림장이 성공적으로 작성되었습니다.",
                    null
            );
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        APIError apiError = new APIError("UNAUTHORIZED", "유효한 JWT 토큰이 필요합니다.");

        APIResponse<Void> responseData = new APIResponse<>(
                "success",
                null,
                "알림장 작성을 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);

    }
}
