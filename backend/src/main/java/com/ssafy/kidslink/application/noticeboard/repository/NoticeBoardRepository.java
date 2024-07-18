package com.ssafy.kidslink.application.noticeboard.repository;

import com.ssafy.kidslink.application.noticeboard.domain.NoticeBoard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticeBoardRepository extends JpaRepository<NoticeBoard, Integer> {
    // 필요한 커스텀 쿼리는 여기에 추가
}
