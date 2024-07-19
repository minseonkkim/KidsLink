package com.ssafy.kidslink.application.noticeboard.mapper;

import com.ssafy.kidslink.application.noticeboard.domain.NoticeBoard;
import com.ssafy.kidslink.application.noticeboard.dto.NoticeBoardDTO;
import org.springframework.stereotype.Component;

@Component
public class NoticeBoardMapper {
    public NoticeBoardDTO toDTO(NoticeBoard noticeBoard) {
        NoticeBoardDTO dto = new NoticeBoardDTO();
        dto.setContent(noticeBoard.getNoticeBoardContent());
        dto.setTitle(noticeBoard.getNoticeBoardTitle());
        dto.setCreateDate(noticeBoard.getNoticeBoardDate());
        return dto;
    }

}
