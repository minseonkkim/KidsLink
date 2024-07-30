package com.ssafy.kidslink.application.meeting.repository;

import com.ssafy.kidslink.application.meeting.domain.MeetingSchedule;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MeetingScheduleRepository extends JpaRepository<MeetingSchedule, Integer> {
    List<MeetingSchedule> findByTeacher(Teacher teahcer);
    List<MeetingSchedule> findByParent(Parent parent);
    List<MeetingSchedule> findByTeacherAndMeetingScheduleDate(Teacher teacher, LocalDate date);
    List<MeetingSchedule> findByParentAndMeetingScheduleDate(Parent parent, LocalDate date);
    @Query("SELECT s.meetingScheduleDate FROM MeetingSchedule s WHERE s.parent = :parent AND YEAR(s.meetingScheduleDate) = :year AND MONTH(s.meetingScheduleDate) = :month")
    List<LocalDate> findScheduleDatesByParentAndYearAndMonth(Parent parent, int year, int month);
}
