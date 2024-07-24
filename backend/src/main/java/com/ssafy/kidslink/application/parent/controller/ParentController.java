package com.ssafy.kidslink.application.parent.controller;

import com.ssafy.kidslink.application.parent.dto.JoinDTO;
import com.ssafy.kidslink.application.parent.dto.ParentDTO;
import com.ssafy.kidslink.application.parent.mapper.ParentMapper;
import com.ssafy.kidslink.application.parent.service.ParentService;
import com.ssafy.kidslink.common.dto.APIError;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/parent")
@RequiredArgsConstructor
@Slf4j
public class ParentController {
    private final ParentService parentService;
    private final ParentMapper parentMapper;

    @PostMapping("")
    public ResponseEntity<APIResponse<Void>> joinProcess(@ModelAttribute JoinDTO joinDTO) {
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
                "success",
                null,
                "부모님의 정보 조회를 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }

}
