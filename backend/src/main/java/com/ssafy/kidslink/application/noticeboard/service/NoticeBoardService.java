package com.ssafy.kidslink.application.noticeboard.service;

import com.ssafy.kidslink.application.noticeboard.domain.NoticeBoard;
import com.ssafy.kidslink.application.noticeboard.dto.NoticeBoardDTO;
import com.ssafy.kidslink.application.noticeboard.dto.NoticeBoardRequestDTO;
import com.ssafy.kidslink.application.noticeboard.mapper.NoticeBoardMapper;
import com.ssafy.kidslink.application.noticeboard.repository.NoticeBoardRepository;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
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


    public List<NoticeBoardDTO> getAllNoticeBoards() {
        List<NoticeBoard> noticeBoards = noticeBoardRepository.findAll();
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
    }
}

