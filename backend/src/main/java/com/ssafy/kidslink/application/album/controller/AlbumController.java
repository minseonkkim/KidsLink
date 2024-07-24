package com.ssafy.kidslink.application.album.controller;

import com.ssafy.kidslink.application.album.service.AlbumService;
import com.ssafy.kidslink.application.image.service.ImageService;
import com.ssafy.kidslink.common.dto.User;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartRequest;

import java.io.IOException;

@RestController
@RequestMapping("/api/album")
@RequiredArgsConstructor
@Slf4j
public class AlbumController {
    private final AlbumService albumService;
    private final ImageService imageService;

    @PostMapping("/classify")
//    @Secured("ROLE_TEACHER")
    public String classifyImages(@AuthenticationPrincipal Object principal, MultipartRequest request) throws IOException {
        User user = new User();
        if (principal instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;
            user.setUsername(userDetails.getUsername());
        }
            String json = albumService.classifyImages(user, request);
//        List<ClassifyImageDTO> classifyImages = albumService.classifyImages(user, request);
//        log.info(classifyImages.toString());

//            APIResponse<ParentDTO> responseData = new APIResponse<>(
//                    "success",
//                    parentDTO,
//                    "부모님의 정보를 성공적으로 조회했습니다.",
//                    null
//            );
//            return new ResponseEntity<>(responseData, HttpStatus.OK);


        return json;
    }
}
