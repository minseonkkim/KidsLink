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
    boolean flag = false;
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

    public void deleteMeeting(String teacherUsername){
        Teacher teacher = teacherRepository.findByTeacherUsername(teacherUsername);
        selectedMeetingRepository.deleteByTeacher(teacher);
    }

    public void deleteMeetingTime(String teacherUsername){
        Teacher teacher = teacherRepository.findByTeacherUsername(teacherUsername);
        meetingTimeRepository.deleteByTeacher(teacher);
    }

    public List<SelectedMeetingDTO> getSelectedMeetings(String teacherUsername){
        Teacher teacher = teacherRepository.findByTeacherUsername(teacherUsername);
        List<SelectedMeeting> list = selectedMeetingRepository.findByTeacher(teacher);
        List<SelectedMeetingDTO> meetings = new ArrayList<>();
        for(SelectedMeeting selectedMeeting : list){
            SelectedMeetingDTO meeting = new SelectedMeetingDTO();
            meeting.setTime(selectedMeeting.getSelectedMeetingTime());
            meeting.setDate(selectedMeeting.getSelectedMeetingDate());
            meeting.setTeacherId(teacher.getTeacherId());
            meeting.setTeacherName(teacher.getTeacherName());
            Parent parent = selectedMeeting.getParent();
            meeting.setParentUsername(parent.getParentUsername());
            meeting.setChildName(parent.getChildren().iterator().next().getChildName());
            meetings.add(meeting);
        }

        return meetings;
    }

    public List<SelectedMeetingDTO> classifySchedule(List<SelectedMeetingDTO> selectedMeetingDTOs){
        List<SelectedMeetingDTO> meetingSchedules = allocateMeetings(selectedMeetingDTOs);
        return meetingSchedules;
    }

//    public List<MeetingRoomDTO> confirmMeeting(String teacherUsername) {
//        Teacher teacher = teacherRepository.findByTeacherUsername(teacherUsername);
//        List<SelectedMeeting> meetings = selectedMeetingRepository.findByTeacher(teacher);
//        List<MeetingSchedule> meetingSchedules = allocateMeetings(meetings, teacher);
//        List<MeetingRoomDTO> confirmMeetings = new ArrayList<>();
//
//        for (MeetingSchedule meetingSchedule : meetingSchedules) {
//            meetingScheduleRepository.save(meetingSchedule);
//            confirmMeetings.add(meetingScheduleMapper.toMeetingRoomDTO(meetingSchedule));
//        }
//
//        // TODO #1 부모한테 예약 확정 알림 보내기 -> 부모 한명에게만 보내기
//        for (Parent parent : parentRepository.findByKindergartenClassId(teacher.getKindergartenClass().getKindergartenClassId())) {
//            ParentNotification parentNotification = new ParentNotification();
//
//            parentNotification.setCode(NotificationCode.MEETING);
//            parentNotification.setParent(parent);
//            parentNotification.setParentNotificationDate(LocalDate.now());
//            parentNotification.setParentNotificationText("상담 예약이 확정되었습니다.");
//
//            parentNotificationRepository.save(parentNotification);
//        }
//
//        return confirmMeetings;
//    }

    private List<SelectedMeetingDTO> allocateMeetings(List<SelectedMeetingDTO> selectedMeetingDTOs) {
        // 학부모별로 가능한 시간대를 그룹화
        Map<String, List<SelectedMeetingDTO>> parentMeetingMap = new HashMap<>();

        for (SelectedMeetingDTO dto : selectedMeetingDTOs) {
            String parentUsername = dto.getParentUsername();

            // parentName에 해당하는 리스트가 이미 존재하는지 확인
            if (!parentMeetingMap.containsKey(parentUsername)) {
                parentMeetingMap.put(parentUsername, new ArrayList<>());
            }

            // parentName에 해당하는 리스트에 dto 추가
            parentMeetingMap.get(parentUsername).add(dto);
        }

        // 모든 학부모가 무조건 하나의 시간대를 가지도록 선택
        List<SelectedMeetingDTO> result = new ArrayList<>();
        List<String> parents = new ArrayList<>(parentMeetingMap.keySet());
        System.out.println(parents);
        SelectedMeetingDTO[] resultArr = new SelectedMeetingDTO[100];
        backtrack(parents,parentMeetingMap, resultArr,result, 0);

        return result;
    }
    private void backtrack( List<String> parents, Map<String, List<SelectedMeetingDTO>> parentMeetingMap,
                           SelectedMeetingDTO[] resultArr,List<SelectedMeetingDTO> result, int index) {
        if (flag){
            System.out.println("flag");
            return;
        }
        // 모든 학부모에 대해 시간대 선택이 완료되었을 경우
        if (index == parents.size()) {
            HashSet <String> slotSet = new HashSet<>();

            for (int i = 0; i < parents.size(); i++) {
                String slot = resultArr[i].getDate() + " " + resultArr[i].getTime();
                if(slotSet.contains(slot)) {
                    return;
                }
                slotSet.add(slot);
            }

            for (int i = 0; i < 100; i++) {
                if(resultArr[i]==null){
                    break;
                }
                result.add(resultArr[i]);
            }
            flag = true;
            System.out.println(Arrays.toString(resultArr));
            return;
        }

        String parentName = parents.get(index);
        List<SelectedMeetingDTO> meetings = parentMeetingMap.get(parentName);

        for (int i = 0; i<meetings.size();i++) {
            SelectedMeetingDTO meeting = meetings.get(i);

            // 현재 선택한 결과를 배열에 저장
            resultArr[index] = meeting;

            // 다음 학부모에 대해 백트래킹
            backtrack(parents, parentMeetingMap, resultArr, result,index + 1);

            // 선택을 취소 (백트래킹)
            resultArr[index] = null;
        }
    }


    public MeetingRoomDTO enterMeeting(int id){
        MeetingSchedule meetingSchedule = meetingScheduleRepository.findById(id).orElseThrow();

        MeetingRoomDTO meetingRoomDTO = new MeetingRoomDTO();
        meetingRoomDTO.setId(id);
        meetingRoomDTO.setDate(meetingSchedule.getMeetingScheduleDate());
        meetingRoomDTO.setTime(meetingSchedule.getMeetingScheduleTime());
        Parent parent = meetingSchedule.getParent();
        Teacher teacher = meetingSchedule.getTeacher();
        meetingRoomDTO.setParentId(parent.getParentId());
        meetingRoomDTO.setChildName(parent.getChildren().iterator().next().getChildName());
        meetingRoomDTO.setTeacherId(teacher.getTeacherId());
        meetingRoomDTO.setTeacherName(teacher.getTeacherName());

        return meetingRoomDTO;
    }


}
