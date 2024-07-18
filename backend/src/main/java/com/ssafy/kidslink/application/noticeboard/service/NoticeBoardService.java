package com.ssafy.kidslink.application.noticeboard.service;

import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
import com.ssafy.kidslink.application.kindergartenclass.repository.KindergartenClassRepository;
import com.ssafy.kidslink.application.noticeboard.domain.NoticeBoard;
import com.ssafy.kidslink.application.noticeboard.dto.NoticeBoardDTO;
import com.ssafy.kidslink.application.noticeboard.dto.NoticeBoardRequestDTO;
import com.ssafy.kidslink.application.noticeboard.mapper.NoticeBoardMapper;
import com.ssafy.kidslink.application.noticeboard.repository.NoticeBoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NoticeBoardService {
    @Autowired
    private NoticeBoardRepository noticeBoardRepository;

    @Autowired
    private NoticeBoardMapper noticeBoardMapper;

    @Autowired
    private KindergartenClassRepository kindergartenClassRepository;

    @Autowired
    private JwtUil jwtUil;

    public List<NoticeBoardDTO> getAllNoticeBoards() {
        List<NoticeBoard> noticeBoards = noticeBoardRepository.findAll();
        return noticeBoards.stream()
                .map(noticeBoardMapper::toDTO)
                .collect(Collectors.toList());
    }

    public NoticeBoardDTO getNoticeBoardById(int id) {
        Optional<NoticeBoard> noticeBoard = noticeBoardRepository.findById(id);
        return noticeBoard.map(noticeBoardMapper::toDTO).orElse(null);
    }

    public void createNoticeBoard(String token, NoticeBoardRequestDTO requestDto) {
        String teacherUsername = jwtUtil.getUsername(token); //토큰이용해서 선생님 로그인id 찾기
        KindergartenClass kindergartenClass = kindergartenClassRepository.findById(teacherUsername); // 수정필요 (반 찾기)

        NoticeBoard noticeBoard = new NoticeBoard();
        noticeBoard.setNoticeBoardTitle(requestDto.getTitle());
        noticeBoard.setNoticeBoardContent(requestDto.getContent());
        noticeBoard.setNoticeBoardDate(LocalDate.now());
        noticeBoard.setKindergartenClass(kindergartenClass);

        noticeBoardRepository.save(noticeBoard);
    }
}
}
