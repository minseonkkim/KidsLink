package com.ssafy.kidslink.application.notification.mapper;

import com.ssafy.kidslink.application.notification.domain.ParentNotification;
import com.ssafy.kidslink.application.notification.domain.TeacherNotification;
import com.ssafy.kidslink.application.notification.dto.NotificationDTO;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {
    public NotificationDTO toDTO(TeacherNotification teacherNotification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setCode(teacherNotification.getCode());
        dto.setId(teacherNotification.getTeacherNotificationId());
        dto.setDate(teacherNotification.getTeacherNotificationDate());
        dto.setContents(teacherNotification.getTeacherNotificationText());
        return dto;
    }
    public NotificationDTO toDTO(ParentNotification parentNotification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(parentNotification.getParentNotificationId());
        dto.setDate(parentNotification.getParentNotificationDate());
        dto.setContents(parentNotification.getParentNotificationText());
        dto.setCode(parentNotification.getCode());
        return dto;
    }

}
