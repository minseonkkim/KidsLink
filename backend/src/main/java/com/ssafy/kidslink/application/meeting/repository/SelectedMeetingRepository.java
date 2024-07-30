package com.ssafy.kidslink.application.meetingtime.repository;

import com.ssafy.kidslink.application.meetingtime.domain.SelectedMeeting;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SelectedMeetingRepository extends JpaRepository<SelectedMeeting, Integer> {
    List<SelectedMeeting> findByTeacher(Teacher teacher);
}
