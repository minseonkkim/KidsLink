package com.ssafy.kidslink.parent.controller;

import com.ssafy.kidslink.parent.dto.JoinDTO;
import com.ssafy.kidslink.parent.service.ParentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.RequestEntity;
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
    public ResponseEntity<Void> addParent(@RequestBody JoinDTO joinDTO) {


        return null;
    }

}
