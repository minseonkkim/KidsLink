package com.ssafy.kidslink.common.controller;

import com.ssafy.kidslink.common.dto.APIResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartRequest;

import java.io.IOException;
import java.util.Map;

@Tag(name = "Main API", description = "API for main operations")
public interface SwaggerApiMain {

    @Operation(
            summary = "Upload Photos",
            description = "Uploads photos to the server.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Photos uploaded successfully", content = @Content(schema = @Schema(implementation = APIResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    ResponseEntity<APIResponse<Map<String, Object>>> uploadPhotos(
            @RequestBody(description = "Multipart request containing the photos", required = true) MultipartRequest request)
            throws IOException;

    @Operation(
            summary = "Initialize Data",
            description = "Initializes the data.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Data initialized successfully"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    String initializeData();

    @Operation(
            summary = "Generate Refresh Token",
            description = "Generates a new refresh token.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Refresh token generated successfully", content = @Content(schema = @Schema(implementation = APIResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    ResponseEntity<APIResponse<Map<String, Object>>> generateRefreshToken(
            @Parameter(description = "HTTP request", required = true) HttpServletRequest request,
            @Parameter(description = "HTTP response", required = true) HttpServletResponse response);
}