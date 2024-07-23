package com.ssafy.kidslink.application.kindergarten.controller;

import com.ssafy.kidslink.application.kindergarten.dto.KindergartenDTO;
import com.ssafy.kidslink.application.kindergarten.service.KindergartenService;
import com.ssafy.kidslink.common.dto.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/kindergarten")
@RequiredArgsConstructor
public class KindergartenController {
    private final KindergartenService kindergartenService;

    @GetMapping("")
//    @Secured("ROLE_TEACHER")
    public ResponseEntity<APIResponse<List<KindergartenDTO>>> getKindergartens() {
        List<KindergartenDTO> kindergartens = kindergartenService.findAll();

        APIResponse<List<KindergartenDTO>> responseData = new APIResponse<>(
                "success",
                kindergartens,
                "유치원 조회 성공",
                null
        );

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
