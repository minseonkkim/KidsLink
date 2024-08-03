package com.ssafy.kidslink.application.notification.service;

import com.ssafy.kidslink.application.notification.domain.ParentNotification;
import com.ssafy.kidslink.application.notification.domain.TeacherNotification;
import com.ssafy.kidslink.application.notification.dto.NotificationDTO;
import com.ssafy.kidslink.application.notification.mapper.NotificationMapper;
import com.ssafy.kidslink.application.notification.respository.ParentNotificationRepository;
import com.ssafy.kidslink.application.notification.respository.TeacherNotificationRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import com.ssafy.kidslink.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final TeacherNotificationRepository teacherNotificationRepository;
    private final ParentNotificationRepository parentNotificationRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;

    private final NotificationMapper notificationMapper;

    public List<NotificationDTO> getNotifications(String role, String userName) {
        List<NotificationDTO> notifications = new ArrayList<>();

        if (role.equals("ROLE_TEACHER")) {
            Teacher teacher = teacherRepository.findByTeacherUsername(userName);
            if (teacher != null) {
                for (TeacherNotification notification : teacherNotificationRepository.findByTeacher(teacher)) {
                    notifications.add(notificationMapper.toDTO(notification));
                }
            } else {
                // 적절한 예외 처리
                throw new NotFoundException("Teacher not found for username: " + userName);
            }
        } else if (role.equals("ROLE_PARENT")) {
            Parent parent = parentRepository.findByParentUsername(userName);
            if (parent != null) {
                for (ParentNotification notification : parentNotificationRepository.findByParent(parent)) {
                    notifications.add(notificationMapper.toDTO(notification));
                }
            } else {
                // 적절한 예외 처리
                throw new NotFoundException("Parent not found for username: " + userName);
            }
        } else {
            // 적절한 예외 처리
            throw new IllegalArgumentException("Invalid role: " + role);
        }
        return notifications;
    }


    public int getNotificationCount(String role, String userName){
        int cnt = 0;
        if(role.equals("ROLE_TEACHER")){
            Teacher teacher = teacherRepository.findByTeacherUsername(userName);
            cnt = teacherNotificationRepository.countByTeacher(teacher);
        }else{
            Parent parent = parentRepository.findByParentUsername(userName);
            cnt = parentNotificationRepository.countByParent(parent);
        }
        return cnt;
    }

    public void deleteAllNotifications(String role, String userName){
        if(role.equals("ROLE_TEACHER")){
            Teacher teacher = teacherRepository.findByTeacherUsername(userName);
            teacherNotificationRepository.deleteByTeacher(teacher);
        }else{
            Parent parent = parentRepository.findByParentUsername(userName);
            parentNotificationRepository.deleteByParent(parent);
        }
    }

    public void deleteNotification(String role, int id){
        if(role.equals("ROLE_TEACHER")){
            teacherNotificationRepository.deleteById(id);
        }else{
            parentNotificationRepository.deleteById(id);
        }
    }
}
