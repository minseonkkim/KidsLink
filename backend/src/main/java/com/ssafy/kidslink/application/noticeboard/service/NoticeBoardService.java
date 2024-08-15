package com.ssafy.kidslink.application.noticeboard.service;

import com.ssafy.kidslink.application.noticeboard.domain.NoticeBoard;
import com.ssafy.kidslink.application.noticeboard.dto.NoticeBoardDTO;
import com.ssafy.kidslink.application.noticeboard.dto.NoticeBoardRequestDTO;
import com.ssafy.kidslink.application.noticeboard.mapper.NoticeBoardMapper;
import com.ssafy.kidslink.application.noticeboard.repository.NoticeBoardRepository;
import com.ssafy.kidslink.application.notification.domain.ParentNotification;
import com.ssafy.kidslink.application.notification.respository.ParentNotificationRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import com.ssafy.kidslink.common.enums.NotificationCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NoticeBoardService {
    private final NoticeBoardRepository noticeBoardRepository;
    private final NoticeBoardMapper noticeBoardMapper;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final ParentNotificationRepository parentNotificationRepository;


    public List<NoticeBoardDTO> getAllNoticeBoards(String role, String Username) {
        List<NoticeBoard> noticeBoards = new ArrayList<>();
        if(role.equals("ROLE_TEACHER")){
            noticeBoards = noticeBoardRepository.findByKindergartenClassKindergartenClassId(teacherRepository.findByTeacherUsername(Username)
                    .getKindergartenClass().getKindergartenClassId());
        }else {
            noticeBoards = noticeBoardRepository.findByKindergartenClassKindergartenClassId(parentRepository.findByParentUsername(Username)
                    .getChildren().iterator().next()
                    .getKindergartenClass().getKindergartenClassId());
        }
        List<NoticeBoardDTO> noticeBoardDTOs  = new ArrayList<>();
        for(NoticeBoard noticeBoard : noticeBoards) {
            noticeBoardDTOs.add(noticeBoardMapper.toDTO(noticeBoard));
        }
        return noticeBoardDTOs;
    }

    public NoticeBoardDTO getNoticeBoardDetail(int id) {
        Optional<NoticeBoard> noticeBoard = noticeBoardRepository.findById(id);
        return noticeBoardMapper.toDTO(noticeBoard.get());
    }

    public void createNoticeBoard(String teacherUsername, NoticeBoardRequestDTO requestDto) {
        Teacher teacher = teacherRepository.findByTeacherUsername(teacherUsername);

        NoticeBoard noticeBoard = new NoticeBoard();
        noticeBoard.setNoticeBoardTitle(requestDto.getTitle());
        noticeBoard.setNoticeBoardContent(requestDto.getContent());
        noticeBoard.setNoticeBoardDate(LocalDate.now());
        noticeBoard.setKindergartenClass(teacher.getKindergartenClass());

        noticeBoardRepository.save(noticeBoard);
        for(Parent parent : parentRepository.findByKindergartenClassId(teacher.getKindergartenClass().getKindergartenClassId())) {
            ParentNotification parentNotification = new ParentNotification();
            parentNotification.setCode(NotificationCode.NOTICE);
            parentNotification.setParentNotificationDate(LocalDate.now());
            parentNotification.setParentNotificationText("새로운 알림장이 등록되었습니다.");
            parentNotification.setParent(parent);

            parentNotificationRepository.save(parentNotification);
        }
    }
}
