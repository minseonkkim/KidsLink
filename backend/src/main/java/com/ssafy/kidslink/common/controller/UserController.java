package com.ssafy.kidslink.common.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.exception.RequestDataException;
import com.ssafy.kidslink.common.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final ObjectMapper objectMapper;

    @PostMapping("/exists")
    public ResponseEntity<APIResponse<Boolean>> existsUsername(@RequestBody String requestBody) {
        try {
            JsonNode jsonNode = objectMapper.readTree(requestBody);
            String username = jsonNode.get("username").asText();
            APIResponse<Boolean> responseData;

            if (userService.isExistUser(username)) {
                responseData = new APIResponse<>(
                        "success",
                        true,
                        "해당 유저가 존재합니다.",
                        null
                );
            } else {
                responseData = new APIResponse<>(
                        "success",
                        false,
                        "해당 유저가 존재하지 않습니다.",
                        null
                );
            }
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }catch (Exception e) {
            throw new RequestDataException("요청 데이터 문제 발생");
        }
    }
}
