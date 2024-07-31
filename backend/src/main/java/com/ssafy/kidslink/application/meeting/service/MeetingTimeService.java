package com.ssafy.kidslink.application.meeting.service;

import com.ssafy.kidslink.application.meeting.domain.MeetingSchedule;
import com.ssafy.kidslink.application.meeting.dto.*;
import com.ssafy.kidslink.application.meeting.mapper.MeetingScheduleMapper;
import com.ssafy.kidslink.application.meeting.repository.MeetingScheduleRepository;
import com.ssafy.kidslink.application.meeting.domain.MeetingTime;
import com.ssafy.kidslink.application.meeting.domain.SelectedMeeting;
import com.ssafy.kidslink.application.meeting.mapper.MeetingTimeMapper;
import com.ssafy.kidslink.application.meeting.repository.MeetingTimeRepository;
import com.ssafy.kidslink.application.meeting.repository.SelectedMeetingRepository;
import com.ssafy.kidslink.application.notification.domain.ParentNotification;
import com.ssafy.kidslink.application.notification.domain.TeacherNotification;
import com.ssafy.kidslink.application.notification.respository.ParentNotificationRepository;
import com.ssafy.kidslink.application.notification.respository.TeacherNotificationRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import com.ssafy.kidslink.common.enums.NotificationCode;
import com.ssafy.kidslink.common.exception.InvalidPrincipalException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class MeetingTimeService {

    private final TeacherRepository teacherRepository;
    private final MeetingTimeRepository meetingTimeRepository;
    private final ParentRepository parentRepository;
    private final MeetingTimeMapper meetingTimeMapper;
    private final MeetingScheduleRepository meetingScheduleRepository;
    private final MeetingScheduleMapper meetingScheduleMapper;
    private final TeacherNotificationRepository teacherNotificationRepository;
    private final SelectedMeetingRepository selectedMeetingRepository;
    private final ParentNotificationRepository parentNotificationRepository;

    public void openMeetingTimes(String teacherUsername, List<OpenMeetingTimeDTO> openMeetingTimeDTOList) {
        Teacher teacher = teacherRepository.findByTeacherUsername(teacherUsername);

        for(OpenMeetingTimeDTO openMeetingTimeDTO : openMeetingTimeDTOList) {
            for(String time : openMeetingTimeDTO.getTimes()) {
                MeetingTime meetingTime =  new MeetingTime();
                meetingTime.setTeacher(teacher);
                meetingTime.setMeetingDate(LocalDate.parse(openMeetingTimeDTO.getDate()));
                meetingTime.setMeetingTime(time);
                meetingTimeRepository.save(meetingTime);
            }

        }
    }

    public List<MeetingTimeDTO> getMeetingTimes(UserDetails userDetails) {
        String usernmae = userDetails.getUsername();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        List<MeetingTimeDTO> meetingTimes = new ArrayList<>();
        int classId;
        if ("ROLE_PARENT".equals(role)) {
            classId = parentRepository.findByParentUsername(usernmae).getChildren().stream().findFirst().orElseThrow()
                    .getKindergartenClass().getKindergartenClassId();
            for (MeetingTime meetingTime : meetingTimeRepository.findByClassId(classId)) {
                meetingTimes.add(meetingTimeMapper.toDTO(meetingTime));
            }
        } else if ("ROLE_TEACHER".equals(role)) {
            Teacher teacher = teacherRepository.findByTeacherUsername(usernmae);
            for (MeetingTime meetingTime : meetingTimeRepository.findByTeacher(teacher)) {
                meetingTimes.add(meetingTimeMapper.toDTO(meetingTime));
            }
        } else {
            throw new InvalidPrincipalException("Invalid user principal");
        }
        return meetingTimes;
    }

    public void selectMeeting(String parentUsername, List<ReserveMeetingDTO> reserveMeetingDTOS) {
        Parent parent = parentRepository.findByParentUsername(parentUsername);

        for(ReserveMeetingDTO dto : reserveMeetingDTOS) {
            SelectedMeeting selectedMeeting = new SelectedMeeting();
            selectedMeeting.setSelectedMeetingDate(dto.getMeetingDate());
            selectedMeeting.setSelectedMeetingTime(dto.getMeetingTime());
            selectedMeeting.setParent(parent);
            selectedMeeting.setTeacher(teacherRepository.findByKindergartenClass(
                    parent.getChildren().stream().findFirst().get().getKindergartenClass()));

            selectedMeetingRepository.save(selectedMeeting);

        }

        TeacherNotification teacherNotification = new TeacherNotification();
        teacherNotification.setCode(NotificationCode.MEETING);
        teacherNotification.setTeacherNotificationDate(LocalDate.now());
        teacherNotification.setTeacher(teacherRepository.findByKindergartenClass(parent.getChildren().iterator().next().getKindergartenClass()));
        teacherNotification.setTeacherNotificationText("학부모 상담 신청이 도착하였습니다.");
        teacherNotificationRepository.save(teacherNotification);


    }

    public List<MeetingScheduleDTO> getMeetingReservations(String role, String Username) {
        List<MeetingScheduleDTO> meetingReservations = new ArrayList<>();
        if(role.equals("ROLE_TEACHER")) {
            Teacher teacher = teacherRepository.findByTeacherUsername(Username);
            for(MeetingSchedule meetingSchedule : meetingScheduleRepository.findByTeacher(teacher)){
                meetingReservations.add(meetingScheduleMapper.toDTO(meetingSchedule));
            }
        }
        else {
            Parent parent = parentRepository.findByParentUsername(Username);
            for(MeetingSchedule meetingSchedule : meetingScheduleRepository.findByParent(parent)){
                meetingReservations.add(meetingScheduleMapper.toDTO(meetingSchedule));
            }
        }
        return meetingReservations;

    }



    public void confirmMeeting(String teacherUsername) {
        Teacher teacher = teacherRepository.findByTeacherUsername(teacherUsername);
        List<SelectedMeeting> meetings = selectedMeetingRepository.findByTeacher(teacher);
        List<MeetingSchedule> meetingSchedules = allocateMeetings(meetings, teacher);

        for (MeetingSchedule meetingSchedule : meetingSchedules) {
            meetingScheduleRepository.save(meetingSchedule);
        }

        // 부모한테 예약 확정 알림 보내기
        for (Parent parent : parentRepository.findByKindergartenClassId(teacher.getKindergartenClass().getKindergartenClassId())) {
            ParentNotification parentNotification = new ParentNotification();

            parentNotification.setCode(NotificationCode.MEETING);
            parentNotification.setParent(parent);
            parentNotification.setParentNotificationDate(LocalDate.now());
            parentNotification.setParentNotificationText("상담 예약이 확정되었습니다.");

            parentNotificationRepository.save(parentNotification);
        }
    }

    private List<MeetingSchedule> allocateMeetings(List<SelectedMeeting> meetings, Teacher teacher) {
        // 학부모가 요청한 모든 시간대 목록 생성
        Map<Parent, List<SelectedMeeting>> parentMeetings = new HashMap<>();
        for (SelectedMeeting meeting : meetings) {
            Parent parent = meeting.getParent();
            parentMeetings.putIfAbsent(parent, new ArrayList<>());
            parentMeetings.get(parent).add(meeting);
        }

        List<Parent> parents = new ArrayList<>(parentMeetings.keySet());
        int n = parents.size();

        // DP 테이블 초기화
        int[] dp = new int[1 << n];
        List<SelectedMeeting>[] dpMeetings = new ArrayList[1 << n];
        for (int i = 0; i < (1 << n); i++) {
            dpMeetings[i] = new ArrayList<>();
        }

        // 가능한 모든 시간대
        Set<String> allSlots = new HashSet<>();
        for (SelectedMeeting meeting : meetings) {
            String slot = meeting.getSelectedMeetingDate() + " " + meeting.getSelectedMeetingTime();
            allSlots.add(slot);
        }
        List<String> slots = new ArrayList<>(allSlots);

        // DP를 이용하여 최대 학부모 상담 배정 계산
        for (String slot : slots) {
            int[] newDp = dp.clone();
            List<SelectedMeeting>[] newDpMeetings = new ArrayList[1 << n];
            for (int i = 0; i < (1 << n); i++) {
                newDpMeetings[i] = new ArrayList<>(dpMeetings[i]);
            }

            for (int mask = 0; mask < (1 << n); mask++) {
                for (int i = 0; i < n; i++) {
                    if ((mask & (1 << i)) == 0) {
                        Parent parent = parents.get(i);
                        for (SelectedMeeting meeting : parentMeetings.get(parent)) {
                            String meetingSlot = meeting.getSelectedMeetingDate() + " " + meeting.getSelectedMeetingTime();
                            if (meetingSlot.equals(slot)) {
                                int newMask = mask | (1 << i);
                                if (newDp[newMask] < dp[mask] + 1) {
                                    newDp[newMask] = dp[mask] + 1;
                                    newDpMeetings[newMask] = new ArrayList<>(dpMeetings[mask]);
                                    newDpMeetings[newMask].add(meeting);
                                }
                            }
                        }
                    }
                }
            }

            dp = newDp;
            dpMeetings = newDpMeetings;
        }

        // 최적의 배정 조합 선택
        int bestMask = 0;
        for (int mask = 0; mask < (1 << n); mask++) {
            if (dp[mask] > dp[bestMask]) {
                bestMask = mask;
            }
        }

        // MeetingSchedule 리스트 생성
        List<MeetingSchedule> meetingSchedules = new ArrayList<>();
        for (SelectedMeeting meeting : dpMeetings[bestMask]) {
            MeetingSchedule meetingSchedule = new MeetingSchedule();
            meetingSchedule.setMeetingScheduleDate(meeting.getSelectedMeetingDate());
            meetingSchedule.setMeetingScheduleTime(meeting.getSelectedMeetingTime());
            meetingSchedule.setTeacher(teacher);
            meetingSchedule.setParent(meeting.getParent());
            meetingSchedules.add(meetingSchedule);
        }

        return meetingSchedules;
    }




    public MeetingRoomDTO enterMeeting(int id){
        Optional<MeetingSchedule> meetingSchedule = meetingScheduleRepository.findById(id);

        MeetingRoomDTO meetingRoomDTO = new MeetingRoomDTO();
        meetingRoomDTO.setId(id);
        meetingRoomDTO.setDate(meetingSchedule.get().getMeetingScheduleDate());
        meetingRoomDTO.setTime(meetingSchedule.get().getMeetingScheduleTime());
        meetingRoomDTO.setParentId(meetingSchedule.get().getParent().getParentId());
        meetingRoomDTO.setChildName(meetingSchedule.get().getParent().getChildren().iterator().next().getChildName());
        meetingRoomDTO.setTeahcerId(meetingSchedule.get().getTeacher().getTeacherId());
        meetingRoomDTO.setTeacherName(meetingSchedule.get().getTeacher().getTeacherName());

        return meetingRoomDTO;
    }


}
