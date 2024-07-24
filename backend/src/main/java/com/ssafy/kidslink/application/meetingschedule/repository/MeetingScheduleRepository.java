package com.ssafy.kidslink.application.meetingschedule.repository;

import com.ssafy.kidslink.application.meetingschedule.domain.MeetingSchedule;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingScheduleRepository extends JpaRepository<MeetingSchedule, Long> {
    List<MeetingSchedule> findByTeacher(Teacher teahcer);
    List<MeetingSchedule> findByParent(Parent parent);
}
