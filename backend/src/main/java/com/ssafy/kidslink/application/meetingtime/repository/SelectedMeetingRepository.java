package com.ssafy.kidslink.application.meetingtime.repository;

import com.ssafy.kidslink.application.meetingtime.domain.SelectedMeeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SelectedMeetingRepository extends JpaRepository<SelectedMeeting, Integer> {

}
