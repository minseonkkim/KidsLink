package com.ssafy.kidslink.application.document.controller;

import com.ssafy.kidslink.application.document.dto.AbsentDTO;
import com.ssafy.kidslink.application.document.dto.DocumentDTO;
import com.ssafy.kidslink.application.document.dto.DosageDTO;
import com.ssafy.kidslink.application.document.service.AbsentService;
import com.ssafy.kidslink.application.document.service.DocumentService;
import com.ssafy.kidslink.application.document.service.DosageService;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/document")
@RequiredArgsConstructor
@Slf4j
public class DocumentController {
    private final AbsentService absentService;
    private final DosageService dosageService;
    private final DocumentService documentService;



    @Operation(summary = "모든 문서 조회", description = "모든 문서를 날짜순으로 가져옵니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "모든 문서 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @GetMapping("")
    public ResponseEntity<APIResponse<List<DocumentDTO>>> getAllDocuments(@AuthenticationPrincipal Object principal) {

        List<DocumentDTO> allDocuments = documentService.getAllDocuments(principal);

        APIResponse<List<DocumentDTO>> responseData = new APIResponse<>(
                "success",
                allDocuments,
                "모든 문서를 날짜순으로 가져왔습니다.",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(responseData);

    }





    @Operation(summary = "아이의 모든 문서 조회", description = "해당 아이의 모든 서류를 가져옵니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string")),
                    @Parameter(name = "childId", description = "아이 ID", required = true, in = ParameterIn.PATH, schema = @Schema(type = "integer"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "아이의 모든 문서 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @GetMapping("/child/{childId}")
    public ResponseEntity<APIResponse<List<DocumentDTO>>> getAllDocumentsByChild(@AuthenticationPrincipal Object principal,@PathVariable int childId) {
        List<DocumentDTO> allDocumentsByChild = documentService.getAllDocumentsByChild(childId);

        APIResponse<List<DocumentDTO>> responseData = new APIResponse<>(
                "success",
                allDocumentsByChild,
                "해당 아이의 모든 서류를 가져왔습니다.",
                null
        );

        return ResponseEntity.status(HttpStatus.OK).body(responseData);
    }




    @Operation(summary = "결석 사유서 작성", description = "해당 아이의 결석 사유서를 작성합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string")),
                    @Parameter(name = "childId", description = "아이 ID", required = true, in = ParameterIn.PATH, schema = @Schema(type = "integer"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "결석 사유서 작성 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "결석 사유서 작성 실패",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @PostMapping("/absent/{childId}")
    public ResponseEntity<APIResponse<Void>> createAbsent(@PathVariable int childId,@RequestBody AbsentDTO absentDTO) {
        absentService.createAbsent(childId,absentDTO);

        APIResponse<Void> responseData = new APIResponse<>(
                "success",
                null,
                "결석사유서가 성공적으로 작성되었습니다.",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(responseData);
    }





    @Operation(summary = "투약 관리서 작성", description = "해당 아이의 투약 관리서를 작성합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string")),
                    @Parameter(name = "childId", description = "아이 ID", required = true, in = ParameterIn.PATH, schema = @Schema(type = "integer"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "투약 관리서 작성 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "투약 관리서 작성 실패",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @PostMapping("/dosage/{childId}")
    public ResponseEntity<APIResponse<Void>> createDosage(@PathVariable int childId, @RequestBody DosageDTO dosageDTO) {
        dosageService.createDosage(childId,dosageDTO);

        APIResponse<Void> responseData = new APIResponse<>(
                "success",
                null,
                "투약관리서가 성공적으로 작성되었습니다.",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(responseData);
    }





    @Operation(summary = "투약 정보 조회", description = "투약 ID로 해당 아이의 투약 정보를 조회합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string")),
                    @Parameter(name = "dosageId", description = "투약 ID", required = true, in = ParameterIn.PATH, schema = @Schema(type = "integer"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "투약 정보 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "404", description = "투약 정보 조회 실패",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @GetMapping("/dosage/{dosageId}")
    public ResponseEntity<APIResponse<DosageDTO>> getDosageByDosageId(@PathVariable int dosageId) {
        DosageDTO dosageDTO = dosageService.getDosageByDosageId(dosageId);
        APIResponse<DosageDTO> responseData = new APIResponse<>(
                "success",
                dosageDTO,
                "해당 아이의 투약정보를 가져왔습니다.",
                null
        );

        return ResponseEntity.status(HttpStatus.OK).body(responseData);
    }





    @Operation(summary = "결석 사유서 조회", description = "결석 ID로 해당 아이의 결석 사유서를 조회합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string")),
                    @Parameter(name = "absentId", description = "결석 ID", required = true, in = ParameterIn.PATH, schema = @Schema(type = "integer"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "결석 사유서 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "404", description = "결석 사유서 조회 실패",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @GetMapping("/absent/{absentId}")
    public ResponseEntity<APIResponse<AbsentDTO>> getAbsentByAbsentId(@PathVariable int absentId) {
        AbsentDTO absentDTO = absentService.getAbsentByAbsentId(absentId);
        APIResponse<AbsentDTO> responseData = new APIResponse<>(
                "success",
                absentDTO,
                "해당 아이의 결석정보를 가져왔습니다.",
                null
        );

        return ResponseEntity.status(HttpStatus.OK).body(responseData);
    }




    @Operation(summary = "결석 이슈 승인", description = "결석 ID로 결석 이슈를 승인합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string")),
                    @Parameter(name = "absentId", description = "결석 ID", required = true, in = ParameterIn.PATH, schema = @Schema(type = "integer"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "결석 이슈 승인 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "404", description = "결석 이슈 승인 실패",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @PutMapping("/absent/{absentId}")
    public ResponseEntity<APIResponse<Void>> updateAbsent(@PathVariable int absentId) {
        absentService.updateAbsent(absentId);
        APIResponse<Void> responseData = new APIResponse<>(
                "success",
                null,
                "결석 이슈를 승인했습니다.",
                null
        );
        return new ResponseEntity<>(responseData, HttpStatus.OK);

    }




    @Operation(summary = "투약 이슈 승인", description = "투약 ID로 투약 이슈를 승인합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string")),
                    @Parameter(name = "dosageId", description = "투약 ID", required = true, in = ParameterIn.PATH, schema = @Schema(type = "integer"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "투약 이슈 승인 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "404", description = "투약 이슈 승인 실패",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @PutMapping("/dosage/{dosageId}")
    public ResponseEntity<APIResponse<Void>> updateDosage(@PathVariable int dosageId) {
        dosageService.updateDosage(dosageId);
        APIResponse<Void> responseData = new APIResponse<>(
                "success",
                null,
                "투약 이슈를 승인했습니다.",
                null

        );
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }



}
