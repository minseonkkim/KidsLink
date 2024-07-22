package com.ssafy.kidslink.application.diary.controller;

import com.ssafy.kidslink.application.diary.dto.DiaryDTO;
import com.ssafy.kidslink.application.diary.service.DiaryService;
import com.ssafy.kidslink.common.dto.APIResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diary")
@RequiredArgsConstructor
@Slf4j
public class DiaryController {

    private final DiaryService diaryService;

    /*
    ##1. 사진 넣는 거 구현 해야함 (DB설정 ~ domain 모두 다)
     */
    @PostMapping("/{childId}")
    public ResponseEntity<APIResponse<Void>> createDiary(@PathVariable int childId, @RequestBody DiaryDTO diaryDTO) {
        diaryService.createDiary(childId, diaryDTO);
        APIResponse<Void> responseData = new APIResponse<>(
                "success",
                null,
                "성장일지가 성공적으로 작성되었습니다.",
                null
        );
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }


}
