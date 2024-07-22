package com.ssafy.kidslink.application.meetingtime.repository;

import com.ssafy.kidslink.application.meetingtime.domain.MeetingTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingTimeRepository extends JpaRepository<MeetingTime, Long> {
    @Query("SELECT mt FROM MeetingTime mt WHERE mt.teacher.kindergartenClass.kindergartenClassId = :classId")
    List<MeetingTime> findByClassId(@Param("classId") int classId);
}
