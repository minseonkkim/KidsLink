package com.ssafy.kidslink.application.document.controller;

import com.ssafy.kidslink.application.document.dto.AbsentDTO;
import com.ssafy.kidslink.application.document.dto.DocumentDTO;
import com.ssafy.kidslink.application.document.dto.DosageDTO;
import com.ssafy.kidslink.application.document.service.AbsentService;
import com.ssafy.kidslink.application.document.service.DocumentService;
import com.ssafy.kidslink.application.document.service.DosageService;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.dto.User;
import com.ssafy.kidslink.common.exception.InvalidPrincipalException;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import com.ssafy.kidslink.common.util.PrincipalUtils;
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
    @GetMapping("/absent/{absentId}")
    public ResponseEntity<APIResponse<AbsentDTO>> getAbsentByAbsentId(@PathVariable int absentId) {
        AbsentDTO absentDTO = absentService.getAbsentByAbsentId(absentId);
        APIResponse<AbsentDTO> responseData = new APIResponse<>(
                "success",
                absentDTO,
                "해당 아이의 투약정보를 가져왔습니다.",
                null
        );

        return ResponseEntity.status(HttpStatus.OK).body(responseData);
    }

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
