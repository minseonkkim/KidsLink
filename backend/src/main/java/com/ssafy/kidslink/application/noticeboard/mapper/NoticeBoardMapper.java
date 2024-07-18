package com.ssafy.kidslink.application.noticeboard.mapper;

import com.ssafy.kidslink.application.noticeboard.domain.NoticeBoard;
import com.ssafy.kidslink.application.noticeboard.dto.NoticeBoardDTO;
import org.springframework.stereotype.Component;

@Component
public class NoticeBoardMapper {
    public NoticeBoardDTO toDTO(NoticeBoard noticeBoard) {
        NoticeBoardDTO dto = new NoticeBoardDTO();
        dto.setTeacherName(noticeBoard.getKindergartenClass().getTeachers().get(0).getTeacherName()); // 가정: Teacher 엔티티가 KindergartenClass에 포함됨
        dto.setTitle(noticeBoard.getNoticeBoardTitle());
        dto.setContent(noticeBoard.getNoticeBoardContent());
        dto.setCreateDate(noticeBoard.getNoticeBoardDate());
        dto.setCreateTime(noticeBoard.getNoticeBoardDate().atStartOfDay().toLocalTime()); // 가정: 시간 정보가 없다면 임시로 설정
        return dto;
    }
}
