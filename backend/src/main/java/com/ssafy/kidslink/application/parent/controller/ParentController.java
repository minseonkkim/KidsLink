package com.ssafy.kidslink.application.parent.controller;

import com.ssafy.kidslink.application.child.dto.ChildDTO;
import com.ssafy.kidslink.application.parent.dto.ParentJoinDTO;
import com.ssafy.kidslink.application.parent.dto.ParentDTO;
import com.ssafy.kidslink.application.parent.mapper.ParentMapper;
import com.ssafy.kidslink.application.parent.service.ParentService;
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
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/parent")
@RequiredArgsConstructor
@Slf4j
public class ParentController {
    private final ParentService parentService;
    private final ParentMapper parentMapper;


    @Operation(summary = "부모 회원 가입", description = "부모 회원 가입을 처리합니다.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "부모 회원 가입 요청 데이터",
                    content = @Content(mediaType = "application/x-www-form-urlencoded",
                            schema = @Schema(implementation = ParentJoinDTO.class))
            ))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "부모 회원 가입 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "유효하지 않은 요청",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @PostMapping("")
    public ResponseEntity<APIResponse<Void>> joinProcess(@ModelAttribute ParentJoinDTO joinDTO) {
        log.info("joinDTO : {}", joinDTO);

        parentService.joinProcess(joinDTO);

        APIResponse<Void> responseData = new APIResponse<>(
                "success",
                null,
                "부모 회원 가입 성공",
                null
        );
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }


    @Operation(summary = "부모 정보 조회", description = "부모님의 정보를 조회합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "부모님 정보 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "유효하지 않은 JWT 토큰",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @GetMapping("")
    @Secured("ROLE_PARENT")
    public ResponseEntity<APIResponse<ParentDTO>> getProcesses(@AuthenticationPrincipal Object principal) {
        log.info("getProcesses : {}", principal);
        ParentDTO parentDTO = new ParentDTO();

        if (principal instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;

            parentDTO = parentMapper.toDTO(parentService.getDetailByUsername(userDetails.getUsername()));

            APIResponse<ParentDTO> responseData = new APIResponse<>(
                    "success",
                    parentDTO,
                    "부모님의 정보를 성공적으로 조회했습니다.",
                    null
            );
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        APIError apiError = new APIError("UNAUTHORIZED", "유효한 JWT 토큰이 필요합니다.");

        APIResponse<ParentDTO> responseData = new APIResponse<>(
                "fail",
                null,
                "부모님의 정보 조회를 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }


    @Operation(summary = "부모의 자녀 목록 조회", description = "부모님이 소유한 자녀들의 정보를 조회합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "자녀 정보 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "유효하지 않은 요청",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @GetMapping("/children")
    public ResponseEntity<APIResponse<Set<ChildDTO>>> getMyChildren(@AuthenticationPrincipal Object principal) {
        if (principal instanceof CustomUserDetails userDetails) {
            Set<ChildDTO> childrenSet = parentService.getMyChildren(userDetails.getUsername());

            APIResponse<Set<ChildDTO>> responseData = new APIResponse<>(
                    "success",
                    childrenSet,
                    "부모님이 소유한 아이들의 정보를 성공적으로 조회했습니다.",
                    null
            );

            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        throw new InvalidPrincipalException("Invalid user principal");
    }

}
