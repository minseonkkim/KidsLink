package com.ssafy.kidslink.application.noticeboard.mapper;

import com.ssafy.kidslink.application.noticeboard.domain.NoticeBoard;
import com.ssafy.kidslink.application.noticeboard.dto.NoticeBoardDTO;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NoticeBoardMapper {
    private final TeacherRepository teacherRepository;
    public NoticeBoardDTO toDTO(NoticeBoard noticeBoard) {
        NoticeBoardDTO dto = new NoticeBoardDTO();
        dto.setNoticeBoardId(noticeBoard.getNoticeBoardId());
        dto.setContent(noticeBoard.getNoticeBoardContent());
        dto.setTitle(noticeBoard.getNoticeBoardTitle());
        dto.setTeacherName(teacherRepository.findByKindergartenClass(noticeBoard.getKindergartenClass()).getTeacherName());
        dto.setNoticeBoardDate(noticeBoard.getNoticeBoardDate());
        return dto;
    }

}
