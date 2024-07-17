package com.ssafy.kidslink.parent.controller;

import com.ssafy.kidslink.api.APIResponse;
import com.ssafy.kidslink.parent.dto.JoinDTO;
import com.ssafy.kidslink.parent.service.ParentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/parent")
@RequiredArgsConstructor
public class ParentController {
    private final ParentService parentService;

    @PostMapping
    public ResponseEntity<APIResponse> joinProcess(@RequestBody JoinDTO joinDTO) {
        parentService.joinProcess(joinDTO);

        APIResponse<Void> responseData = new APIResponse<>(
                "error",
                null,
                "부모 회원 가입 성공",
                null
        );

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

}
