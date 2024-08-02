package com.ssafy.kidslink.common.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.exception.RequestDataException;
import com.ssafy.kidslink.common.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final ObjectMapper objectMapper;
    private final HttpSession httpSession;

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

    @GetMapping("/oauth2")
    public ResponseEntity<APIResponse<Map<String, Object>>> getOAuth2InfoBySession(){
        Map<String, Object> oauth2Info = userService.getOAuth2Info(httpSession);
        APIResponse<Map<String, Object>> responseData = new APIResponse<>(
                "success",
                oauth2Info,
                "현재 OAuth2 User 정보 관련 응답입니다.",
                null
        );

        return ResponseEntity.status(HttpStatus.OK).body(responseData);
    }
}
