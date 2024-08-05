package com.ssafy.kidslink.application.bus.controller;

import com.ssafy.kidslink.application.bus.repository.BusRepository;
import com.ssafy.kidslink.application.bus.service.BusService;
import com.ssafy.kidslink.common.dto.APIError;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/bus")
public class BusController {
    private final BusService busService;

    @PostMapping("{busId}/notification")
    public ResponseEntity<APIResponse<Void>> busPostNotification(@PathVariable("busId") int busId) {
        busService.sendBusNotification(busId);
        APIResponse<Void> responseData = new APIResponse<>(
                "success",
                null,
                "버스 출발 알림이 전송되었습니다.",
                null
        );
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
