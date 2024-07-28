package com.ssafy.kidslink.application.notification.controller;

import com.ssafy.kidslink.application.notification.dto.NotificationDTO;
import com.ssafy.kidslink.application.notification.service.NotificationService;
import com.ssafy.kidslink.common.dto.APIError;
import com.ssafy.kidslink.common.dto.APIResponse;
import com.ssafy.kidslink.common.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;

@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<APIResponse<List<NotificationDTO>>> getNotifications(@AuthenticationPrincipal Object principal){
        if (principal instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;

            Collection<? extends GrantedAuthority> collection = userDetails.getAuthorities();
            Iterator<? extends GrantedAuthority> it = collection.iterator();
            GrantedAuthority auth = it.next();
            String role = auth.getAuthority();

            List<NotificationDTO> notifications = notificationService.getNotifications(role, userDetails.getUsername());
            APIResponse<List<NotificationDTO>> responseData = new APIResponse<>(
                    "success",
                    notifications,
                    "알림 조회에 성공했습니다.",
                    null
            );

            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        APIError apiError = new APIError("UNAUTHORIZED", "유효한 JWT 토큰이 필요합니다.");

        APIResponse<List<NotificationDTO>> responseData = new APIResponse<>(
                "fail",
                null,
                "알림 조회에 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/count")
    public ResponseEntity<APIResponse<Integer>> getNotificationCount(@AuthenticationPrincipal Object principal){
        if (principal instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;

            Collection<? extends GrantedAuthority> collection = userDetails.getAuthorities();
            Iterator<? extends GrantedAuthority> it = collection.iterator();
            GrantedAuthority auth = it.next();
            String role = auth.getAuthority();

            int cnt = notificationService.getNotificationCount(role, userDetails.getUsername());
            APIResponse<Integer> responseData = new APIResponse<>(
                    "success",
                    cnt,
                    "알림 개수 조회에 성공했습니다.",
                    null
            );

            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        APIError apiError = new APIError("UNAUTHORIZED", "유효한 JWT 토큰이 필요합니다.");

        APIResponse<Integer> responseData = new APIResponse<>(
                "fail",
                null,
                "알림 개수 조회에 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);


    }

    @DeleteMapping
    public ResponseEntity<APIResponse<Void>> deleteAllNotifications(@AuthenticationPrincipal Object principal){
        if (principal instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;

            Collection<? extends GrantedAuthority> collection = userDetails.getAuthorities();
            Iterator<? extends GrantedAuthority> it = collection.iterator();
            GrantedAuthority auth = it.next();
            String role = auth.getAuthority();

            notificationService.deleteAllNotifications(role, userDetails.getUsername());
            APIResponse<Void> responseData = new APIResponse<>(
                    "success",
                    null,
                    "전체 알림 삭제에 성공했습니다.",
                    null
            );

            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        APIError apiError = new APIError("UNAUTHORIZED", "유효한 JWT 토큰이 필요합니다.");

        APIResponse<Void> responseData = new APIResponse<>(
                "fail",
                null,
                "전체 알림 삭제에 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> deleteNotification(@AuthenticationPrincipal Object principal, @Parameter(description = "알림 ID") @PathVariable int id) {
        if (principal instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;

            Collection<? extends GrantedAuthority> collection = userDetails.getAuthorities();
            Iterator<? extends GrantedAuthority> it = collection.iterator();
            GrantedAuthority auth = it.next();
            String role = auth.getAuthority();

            notificationService.deleteNotification(role, id);
            APIResponse<Void> responseData = new APIResponse<>(
                    "success",
                    null,
                    "해당 알림 삭제에 성공했습니다.",
                    null
            );

            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        APIError apiError = new APIError("UNAUTHORIZED", "유효한 JWT 토큰이 필요합니다.");

        APIResponse<Void> responseData = new APIResponse<>(
                "fail",
                null,
                "해당 알림 삭제에 실패했습니다.",
                apiError
        );

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }
}

