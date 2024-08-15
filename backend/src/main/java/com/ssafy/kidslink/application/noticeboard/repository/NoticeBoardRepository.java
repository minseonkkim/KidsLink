package com.ssafy.kidslink.application.noticeboard.repository;

import com.ssafy.kidslink.application.noticeboard.domain.NoticeBoard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeBoardRepository extends JpaRepository<NoticeBoard, Integer> {
    List<NoticeBoard> findByKindergartenClassKindergartenClassId(int kindergartenClassId);
}
