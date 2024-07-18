package com.ssafy.kidslink.application.kindergartenclass.repository;

import com.ssafy.kidslink.application.noticeboard.domain.NoticeBoard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KindergartenClassRepository extends JpaRepository<NoticeBoard, Integer> {
}
