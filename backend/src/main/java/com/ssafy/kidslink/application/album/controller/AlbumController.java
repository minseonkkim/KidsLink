package com.ssafy.kidslink.application.album.controller;

import com.ssafy.kidslink.application.album.dto.ClassifyImageDTO;
import com.ssafy.kidslink.application.album.service.AlbumService;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import com.ssafy.kidslink.application.image.service.ImageService;
import com.ssafy.kidslink.application.parent.dto.ParentDTO;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.service.TeacherService;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.dto.User;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/album")
@RequiredArgsConstructor
@Slf4j
public class AlbumController {
    private final AlbumService albumService;
    private final ImageService imageService;

    @PostMapping("/classify")
//    @Secured("ROLE_TEACHER")
    public List<ClassifyImageDTO> classifyImages(@AuthenticationPrincipal Object principal, MultipartRequest request) throws IOException {
        User user = new User();
        if (principal instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;
            user.setUsername(userDetails.getUsername());
        }

        List<ClassifyImageDTO> classifyImages = albumService.classifyImages(user, request);
        System.out.println(classifyImages);


//            APIResponse<ParentDTO> responseData = new APIResponse<>(
//                    "success",
//                    parentDTO,
//                    "부모님의 정보를 성공적으로 조회했습니다.",
//                    null
//            );
//            return new ResponseEntity<>(responseData, HttpStatus.OK);


        return null;
    }
}
