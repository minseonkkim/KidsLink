package com.ssafy.kidslink.application.meeting.repository;

import com.ssafy.kidslink.application.meeting.domain.MeetingTime;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingTimeRepository extends JpaRepository<MeetingTime, Integer> {
    @Query("SELECT mt FROM MeetingTime mt WHERE mt.teacher.kindergartenClass.kindergartenClassId = :classId")
    List<MeetingTime> findByClassId(@Param("classId") int classId);
    List<MeetingTime> findByTeacher(Teacher teacher);

}
