package com.ssafy.kidslink.application.child.controller;

import com.ssafy.kidslink.application.child.dto.ChildDTO;
import com.ssafy.kidslink.application.child.dto.DocumentCheckResponse;
import com.ssafy.kidslink.application.child.service.ChildService;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.exception.InvalidPrincipalException;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/child")
@Slf4j
@RequiredArgsConstructor
public class ChildController {

    private final ChildService childService;

    @GetMapping("/{childId}")
    public ResponseEntity<APIResponse<ChildDTO>> detailProcess(@AuthenticationPrincipal Object principal, @PathVariable int childId) {
        if (principal instanceof CustomUserDetails userDetails) {
            ChildDTO childDTO = childService.getChildInfo(childId);
            APIResponse<ChildDTO> responseData = new APIResponse<>(
                    "success",
                    childDTO,
                    "아이의 정보를 성공적으로 조회했습니다.",
                    null
            );
            return new ResponseEntity<>(responseData, HttpStatus.OK);

        }
        throw new InvalidPrincipalException("Invalid user principal");
    }

    @GetMapping("/{childId}/document/check")
    public ResponseEntity<APIResponse<DocumentCheckResponse>> checkDocument(@PathVariable("childId") Integer childId,
                                                                            @RequestParam String date) {
        DocumentCheckResponse documentCheckResponse = childService.checkDocument(childId, date);
        APIResponse<DocumentCheckResponse> responseData = new APIResponse<>(
                "success",
                documentCheckResponse,
                "아이 문서 여부 조회 성공",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(responseData);
    }

}
