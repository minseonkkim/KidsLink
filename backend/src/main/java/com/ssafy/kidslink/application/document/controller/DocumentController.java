package com.ssafy.kidslink.application.document.controller;

import com.ssafy.kidslink.application.document.dto.AbsentDTO;
import com.ssafy.kidslink.application.document.service.AbsentService;
import com.ssafy.kidslink.application.document.service.DosageService;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/document")
@RequiredArgsConstructor
@Slf4j
public class DocumentController {
    private final AbsentService absentService;
    private final DosageService dosageService;

    @PreAuthorize("isAuthenticated()") //로그인한 사용자만 접근가능 (Spring Security 어노테이션)
    @PostMapping("/absent")
    public ResponseEntity<APIResponse<Void>> createAbsent(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody AbsentDTO absentDTO) {
        absentService.createAbsent(userDetails.getUsername(),absentDTO);
        APIResponse<Void> responseData = new APIResponse<>(
                "success",
                null,
                "결석사유서가 성공적으로 작성되었습니다.",
                null
        );
        return ResponseEntity.ok(responseData);
    }

}
