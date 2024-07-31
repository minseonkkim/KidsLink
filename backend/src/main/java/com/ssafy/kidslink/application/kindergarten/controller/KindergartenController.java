package com.ssafy.kidslink.application.kindergarten.controller;

import com.ssafy.kidslink.application.kindergarten.dto.KindergartenClassDTO;
import com.ssafy.kidslink.application.kindergarten.dto.KindergartenDTO;
import com.ssafy.kidslink.application.kindergarten.dto.ResponseClassInfoDTO;
import com.ssafy.kidslink.application.kindergarten.service.KindergartenService;
import com.ssafy.kidslink.application.teacher.dto.TeacherDTO;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/kindergarten")
@RequiredArgsConstructor
@Slf4j
public class KindergartenController {
    private final KindergartenService kindergartenService;


    @Operation(summary = "유치원 목록 조회", description = "모든 유치원 목록을 조회합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "유치원 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "요청 실패",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @GetMapping("")
    public ResponseEntity<APIResponse<List<KindergartenDTO>>> getKindergartens() {
        List<KindergartenDTO> kindergartens = kindergartenService.getAll();

        APIResponse<List<KindergartenDTO>> responseData = new APIResponse<>(
                "success",
                kindergartens,
                "유치원 조회 성공",
                null
        );

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }




    @Operation(summary = "반 목록 조회", description = "특정 유치원의 모든 반 목록을 조회합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string")),
                    @Parameter(name = "kindergartenId", description = "유치원 ID", required = true, schema = @Schema(type = "integer"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "반 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "404", description = "유치원 찾을 수 없음",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @GetMapping("/{kindergartenId}")
    public ResponseEntity<APIResponse<List<KindergartenClassDTO>>> getClasses(@PathVariable("kindergartenId") Integer kindergartenId) {
        List<KindergartenClassDTO> classes = kindergartenService.getClasses(kindergartenId);

        APIResponse<List<KindergartenClassDTO>> responseData = new APIResponse<>(
                "success",
                classes,
                "반 조회 성공",
                null
        );

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }



    @Operation(summary = "반 정보 조회", description = "특정 반의 상세 정보를 조회합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string")),
                    @Parameter(name = "classId", description = "반 ID", required = true, schema = @Schema(type = "integer"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "반 정보 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "404", description = "반 찾을 수 없음",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @GetMapping("/class/{classId}")
    public ResponseEntity<APIResponse<ResponseClassInfoDTO>> getClassInfo(@PathVariable int classId) {
        ResponseClassInfoDTO responseClassInfoDTO = kindergartenService.getClassInfo(classId);

        APIResponse<ResponseClassInfoDTO> responseData = new APIResponse<>(
                "success",
                responseClassInfoDTO,
                "반 정보 조회에 성공했습니다.",
                null
        );

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // 반 선생님 정보 조회
    @GetMapping("/class/{classId}/teacher")
    public ResponseEntity<APIResponse<TeacherDTO>> getClassTeacher(@PathVariable int classId) {
        TeacherDTO teacherDTO = kindergartenService.findTeacherByKindergartenClass(classId);

        APIResponse<TeacherDTO> responseData = new APIResponse<>(
                "success",
                teacherDTO,
                "선생님 정보 조회에 성공했습니다.",
                null
        );
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
