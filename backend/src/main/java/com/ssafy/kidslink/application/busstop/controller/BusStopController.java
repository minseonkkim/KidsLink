package com.ssafy.kidslink.application.busstop.controller;

import com.ssafy.kidslink.application.busstop.domain.BusStop;
import com.ssafy.kidslink.application.busstop.service.BusStopService;
import com.ssafy.kidslink.application.busstopchild.dto.BusStopChildDTO;
import com.ssafy.kidslink.common.dto.APIResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/busstop")
public class BusStopController {
    private final BusStopService busStopService;

    @GetMapping
    public ResponseEntity<APIResponse<List<BusStop>>> getAllBusStops() {
        List<BusStop> busStops =  busStopService.getAllBusStops();
        APIResponse<List<BusStop>> responseData = new APIResponse<>(
                "success",
                busStops,
                "버스정류장 조회에 성공하였습니다.",
                null
        );

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<List<BusStopChildDTO>>> getBusStopChildren(@PathVariable("id") int id) {
        List<BusStopChildDTO> busStopChildren = busStopService.getBusStopChildren(id);
        APIResponse<List<BusStopChildDTO>> responseData = new APIResponse<>(
                "success",
                busStopChildren,
                "버스정류장별 원생리스트 조회에 성공하였습니다.",
                null
        );

        return new ResponseEntity<>(responseData, HttpStatus.OK);

    }

    @PostMapping("/parent/{childId}")
    public ResponseEntity<APIResponse<Void>> isBoarding(@PathVariable("childId") int childId) {
        busStopService.isBoarding(childId);
        APIResponse<Void> responseData = new APIResponse<>(
                "success",
                null,
                "버스탑승여부 변경에 성공하였습니다.",
                null
        );

        return new ResponseEntity<>(responseData, HttpStatus.OK);

    }
}
