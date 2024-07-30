package com.ssafy.kidslink.application.album.controller;

import com.ssafy.kidslink.application.album.dto.ClassifyImageDTO;
import com.ssafy.kidslink.application.album.dto.RequestAlbumDTO;
import com.ssafy.kidslink.application.album.service.AlbumService;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.exception.InvalidPrincipalException;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartRequest;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/album")
@RequiredArgsConstructor
@Slf4j
public class AlbumController {
    private final AlbumService albumService;

    @PostMapping("")
    public ResponseEntity<APIResponse<Void>> albumUpload(@AuthenticationPrincipal Object principal, @RequestBody RequestAlbumDTO requestAlbumDTO) {
        if(principal instanceof CustomUserDetails userDetails) {
            System.out.println(requestAlbumDTO);
            albumService.uploadAlbum(requestAlbumDTO);
            APIResponse<Void> responseData = new APIResponse<>(
                    "success",
                    null,
                    "앨범을 성공적으로 업로드하였습니다.",
                    null
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
        }
        throw new InvalidPrincipalException("Invalid user principal");
    }


    @PostMapping("/classify")
//    @Secured("ROLE_TEACHER")
    public ResponseEntity<APIResponse<List<ClassifyImageDTO>>> classifyImages(@AuthenticationPrincipal Object principal, MultipartRequest request) throws IOException {
        if (principal instanceof CustomUserDetails userDetails) {
            String teacherUsername = userDetails.getUsername();
            List<ClassifyImageDTO> classifiedImages = albumService.classifyImages(teacherUsername, request);
            APIResponse<List<ClassifyImageDTO>> responseData = new APIResponse<>(
                    "success",
                    classifiedImages,
                    "앨범을 성공적으로 분류하였습니다.",
                    null
            );
            return ResponseEntity.status(HttpStatus.OK).body(responseData);
        }
        throw new InvalidPrincipalException("Invalid user principal");
    }

}
