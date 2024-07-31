package com.ssafy.kidslink.application.album.controller;

import com.ssafy.kidslink.application.album.dto.AlbumDTO;
import com.ssafy.kidslink.application.album.dto.ClassifyImageDTO;
import com.ssafy.kidslink.application.album.dto.RequestAlbumDTO;
import com.ssafy.kidslink.application.album.service.AlbumService;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.exception.InvalidPrincipalException;
import com.ssafy.kidslink.common.security.CustomUserDetails;
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
import org.springframework.web.multipart.MultipartRequest;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/album")
@RequiredArgsConstructor
@Slf4j
public class AlbumController {
    private final AlbumService albumService;

    @Operation(summary = "앨범 업로드", description = "사용자가 앨범을 업로드합니다.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "앨범 업로드 요청 데이터",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = RequestAlbumDTO.class))
            ))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "앨범 업로드 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "유효하지 않은 요청",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @PostMapping("")
    public ResponseEntity<APIResponse<Void>> albumUpload(
            @AuthenticationPrincipal Object principal,
            @RequestBody RequestAlbumDTO requestAlbumDTO
    ) {
        if (principal instanceof CustomUserDetails userDetails) {
            log.info("RequestAlbumDTO: {}", requestAlbumDTO);
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

    @Operation(summary = "이미지 분류", description = "업로드된 이미지를 분류합니다.",
            parameters = {
                    @Parameter(name = "Authorization", description = "JWT 토큰", required = true, in = ParameterIn.HEADER, schema = @Schema(type = "string"))
            },
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "이미지 분류 요청 데이터",
                    content = @Content(mediaType = "multipart/form-data",
                            schema = @Schema(type = "object"))
            ))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "이미지 분류 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "유효하지 않은 요청",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @PostMapping("/classify")
    public ResponseEntity<APIResponse<List<ClassifyImageDTO>>> classifyImages(
            @AuthenticationPrincipal Object principal,
            @RequestPart MultipartRequest request
    ) throws IOException {
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

    @Operation(summary = "아동 앨범 조회", description = "특정 아동의 앨범을 조회합니다.",
            parameters = {
                    @Parameter(name = "childId", description = "아동 ID", required = true, in = ParameterIn.PATH, schema = @Schema(type = "integer"))
            })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "아동 앨범 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class))),
            @ApiResponse(responseCode = "400", description = "유효하지 않은 요청",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = APIResponse.class)))
    })
    @GetMapping("/child/{childId}")
    public ResponseEntity<APIResponse<List<AlbumDTO>>> getChildAlbums(@PathVariable("childId") int childId) {
        List<AlbumDTO> albums = albumService.getChildAlbums(childId);
        APIResponse<List<AlbumDTO>> responseData = new APIResponse<>(
                "success",
                albums,
                "앨범을 성공적으로 조회했습니다.",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(responseData);
    }

    @GetMapping("/{albumId}")
    public ResponseEntity<APIResponse<AlbumDTO>> getAlbumById(@PathVariable("albumId") int albumId) {
        AlbumDTO album = albumService.getAlbumById(albumId);
        APIResponse<AlbumDTO> responseData = new APIResponse<>(
                "success",
                album,
                "앨범을 성공적으로 조회했습니다.",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(responseData);
    }
}
