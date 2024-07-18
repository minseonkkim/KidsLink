package com.ssafy.kidslink.application.parent.controller;

import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.dto.JoinDTO;
import com.ssafy.kidslink.application.parent.mapper.ParentMapper;
import com.ssafy.kidslink.application.parent.service.ParentService;
import com.ssafy.kidslink.common.dto.APIError;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<APIResponse<Void>> joinProcess(@RequestBody JoinDTO joinDTO) {
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
    public ResponseEntity<APIResponse<Parent>> getProcesses(@AuthenticationPrincipal Object principal) {
        log.info("getProcesses : {}", principal);
//        ParentDTO parentDTO = new ParentDTO();

        if (principal instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;

//            if (!"PARENT".equals(user.getRole())) {
//                throw new RuntimeException("부모 권한만 접근 가능");
//            }

//            System.out.println(userDetails.getUsername());
//            System.out.println(parentService.getDetailByUsername(userDetails.getUsername()));
//            parentDTO = parentMapper.toDTO(parentService.getDetailByUsername(userDetails.getUsername()));
//            System.out.println(parentDTO);

            Parent parent = parentService.getDetailByUsername(userDetails.getUsername());
            parent.setChildren(null);
            APIResponse<Parent> responseData = new APIResponse<>(
                    "success",
                    parent,
                    "부모님의 정보를 성공적으로 조회했습니다.",
                    null
            );
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        APIError apiError = new APIError("UNAUTHORIZED", "유효한 JWT 토큰이 필요합니다.");

        APIResponse<Parent> responseData = new APIResponse<>(
                "success",
                null,
                "부모님의 정보 조회를 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }

}
