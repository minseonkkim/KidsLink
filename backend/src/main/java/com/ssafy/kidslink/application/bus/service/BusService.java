package com.ssafy.kidslink.application.bus.service;

import com.ssafy.kidslink.application.bus.repository.BusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BusService {
    private final BusRepository busRepository;

}
