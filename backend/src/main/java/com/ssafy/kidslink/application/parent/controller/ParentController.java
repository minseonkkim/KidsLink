package com.ssafy.kidslink.application.parent.controller;

import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.application.parent.dto.JoinDTO;
import com.ssafy.kidslink.application.parent.service.ParentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/parent")
@RequiredArgsConstructor
@Slf4j
public class ParentController {
    private final ParentService parentService;

    @PostMapping("")
    public ResponseEntity<APIResponse> joinProcess(@RequestBody JoinDTO joinDTO) {
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

}
