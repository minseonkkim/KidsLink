package com.ssafy.kidslink.application.album.controller;

import com.ssafy.kidslink.application.album.service.AlbumService;
import com.ssafy.kidslink.application.image.service.ImageService;
import com.ssafy.kidslink.common.dto.User;
import com.ssafy.kidslink.common.exception.InvalidPrincipalException;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import java.io.IOException;
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
    public String classifyImages(@AuthenticationPrincipal Object principal,  @RequestParam("classifyImages") List<MultipartFile> classifyImages) throws IOException {
        if (principal instanceof CustomUserDetails userDetails) {
            String teacherUsername = userDetails.getUsername();
            log.info("classifyImages {}", teacherUsername);
            String json = albumService.classifyImages(teacherUsername, classifyImages);

            return json;
        }
//        List<ClassifyImageDTO> classifyImages = albumService.classifyImages(user, request);
//        log.info(classifyImages.toString());

//            APIResponse<ParentDTO> responseData = new APIResponse<>(
//                    "success",
//                    parentDTO,
//                    "부모님의 정보를 성공적으로 조회했습니다.",
//                    null
//            );
//            return new ResponseEntity<>(responseData, HttpStatus.OK);

        throw new InvalidPrincipalException("Invalid user principal");
    }
}
