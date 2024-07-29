package com.ssafy.kidslink.application.busstop.controller;

import com.ssafy.kidslink.application.busstop.domain.BusStop;
import com.ssafy.kidslink.application.busstop.service.BusStopService;
import com.ssafy.kidslink.application.busstopchild.dto.BusStopChildDTO;
import com.ssafy.kidslink.common.dto.APIResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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



    @Operation(summary = "버스 정류장 전체 조회", description = "모든 버스 정류장을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "버스 정류장 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
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



    @Operation(summary = "특정 버스 정류장의 원생 리스트 조회", description = "특정 버스 정류장에서 하차한 원생 리스트를 조회합니다.",
            parameters = {
                    @Parameter(name = "id", description = "버스 정류장 ID", required = true, in = ParameterIn.PATH, schema = @Schema(type = "integer"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "버스 정류장 원생 리스트 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "404", description = "버스 정류장 ID가 존재하지 않음",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
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



    @Operation(summary = "아이의 버스 탑승 여부 변경", description = "아이의 버스 탑승 여부를 변경합니다.",
            parameters = {
                    @Parameter(name = "childId", description = "아이 ID", required = true, in = ParameterIn.PATH, schema = @Schema(type = "integer"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "버스 탑승 여부 변경 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "404", description = "아이 ID가 존재하지 않음",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
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
