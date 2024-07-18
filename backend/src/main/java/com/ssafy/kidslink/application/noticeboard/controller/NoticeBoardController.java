package com.ssafy.kidslink.application.noticeboard.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/noticeboard")
public class NoticeBoardController {
//    @Autowired
//    private NoticeBoardService noticeBoardService;
//
//    @GetMapping
//    public ResponseEntity<Map<String, Object>> getNoticeBoards() {
//        List<NoticeBoardDTO> noticeBoards = noticeBoardService.getAllNoticeBoards();
//        Map<String, Object> response = new HashMap<>();
//        response.put("status", "success");
//        response.put("message", "알림장 리스트를 성공적으로 조회했습니다.");
//        response.put("data", noticeBoards);
//        response.put("error", null);
//        return ResponseEntity.ok(response);
//    }
//    @GetMapping("/{id}")
//    public ResponseEntity<Map<String, Object>> getNoticeBoardById(@PathVariable int id) {
//        NoticeBoardDTO noticeBoard = noticeBoardService.getNoticeBoardById(id);
//        Map<String, Object> response = new HashMap<>();
//        if(noticeBoard != null) {
//            response.put("status", "success");
//            response.put("message","알림장 상세 정보를 성공적으로 조회했습니다.");
//            response.put("data", noticeBoard);
//            response.put("error", null);
//        }else{
//            response.put("status", "error");
//            response.put("message","요청한 알림장을 찾을 수 없습니다.");
//            response.put("data", null);
//            response.put("error","NOT_FOUND");
//        }
//        return ResponseEntity.ok(response);
//    }
//
//    @PostMapping
//    public ResponseEntity<Map<String, Object>> createNoticeBoard(@RequestHeader("Authorization") String token, @RequestBody NoticeBoardRequestDTO requestDto) {
//        noticeBoardService.createNoticeBoard(token, requestDto);
//        Map<String, Object> response = new HashMap<>();
//        response.put("status", "success");
//        response.put("message", "알림장이 성공적으로 작성되었습니다.");
//        response.put("data", null);
//        response.put("error", null);
//        return ResponseEntity.ok(response);
//    }
}
