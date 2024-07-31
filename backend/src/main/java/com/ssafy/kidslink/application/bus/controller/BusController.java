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
    private final WebSocketHandler webSocketHandler;
    private final ObjectMapper objectMapper;

    @PostMapping
    public ResponseEntity<Bus> saveLocation(@RequestBody Bus bus) {
        bus.setTimestamp(LocalDateTime.now());
        Bus savedBus = busRepository.save(bus);
        try {
            String message = objectMapper.writeValueAsString(savedBus);
            webSocketHandler.sendMessage(message);
        } catch (IOException e) {
            log.error("Error sending WebSocket message", e);
        }
        return ResponseEntity.ok(savedBus);
    }

    @GetMapping
    public List<Bus> getAllLocations() {
        return busRepository.findAll();
    }

    @GetMapping("/latest")
    public ResponseEntity<Bus> getLatestLocation() {
        Optional<Bus> latestBus = busRepository.findTopByOrderByTimestampDesc();
        return latestBus.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
    }
}
