package com.ssafy.kidslink.application.meetingtime.repository;

import com.ssafy.kidslink.application.meetingtime.domain.MeetingTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetingTimeRepository extends JpaRepository<MeetingTime, Long> {
}
