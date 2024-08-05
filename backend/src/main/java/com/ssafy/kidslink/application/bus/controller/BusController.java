package com.ssafy.kidslink.application.bus.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.kidslink.application.bus.domain.Bus;
import com.ssafy.kidslink.application.bus.repository.BusRepository;
import com.ssafy.kidslink.application.bus.websocket.WebSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/bus")
public class BusController {
    private final BusRepository busRepository;

    

}
