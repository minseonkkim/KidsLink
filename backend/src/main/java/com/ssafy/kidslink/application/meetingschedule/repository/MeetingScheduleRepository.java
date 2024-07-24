package com.ssafy.kidslink.application.meetingschedule.repository;

import com.ssafy.kidslink.application.meetingschedule.domain.MeetingSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetingScheduleRepository extends JpaRepository<MeetingSchedule, Long> {
}
