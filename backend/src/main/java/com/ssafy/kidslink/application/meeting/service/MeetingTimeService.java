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
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
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
    int max = 0;
    private static final int SLOTS_PER_DAY = 48; // 하루의 30분 단위 슬롯 수

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
            meeting.setParentId(parent.getParentId());
            meeting.setChildName(parent.getChildren().iterator().next().getChildName());
            meetings.add(meeting);
        }

        return meetings;
    }

    public List<SelectedMeetingDTO> classifySchedule(List<SelectedMeetingDTO> selectedMeetingDTOs){
        flag = false;
        max = 0;
        List<SelectedMeetingDTO> meetingSchedules = allocateMeetings(selectedMeetingDTOs);
        return meetingSchedules;
    }

    public List<MeetingRoomDTO> confirmMeeting(List<SelectedMeetingDTO> selectedMeetingDTOs) {
        Teacher teacher = teacherRepository.findByTeacherUsername(selectedMeetingDTOs.get(0).getTeacherName());

        List<MeetingRoomDTO> confirmMeetings = new ArrayList<>();
        for (SelectedMeetingDTO selectedMeetingDTO : selectedMeetingDTOs) {
            Parent parent = parentRepository.findById(selectedMeetingDTO.getParentId()).orElseThrow();
            MeetingSchedule meetingSchedule = meetingScheduleMapper.toEntity(selectedMeetingDTO, teacher,parent);
            meetingScheduleRepository.save(meetingSchedule);
            confirmMeetings.add(meetingScheduleMapper.toMeetingRoomDTO(meetingSchedule));
        }

        // TODO #1 부모한테 예약 확정 알림 보내기 -> 부모 한명에게만 보내기
        for (Parent parent : parentRepository.findByKindergartenClassId(teacher.getKindergartenClass().getKindergartenClassId())) {
            ParentNotification parentNotification = new ParentNotification();

            parentNotification.setCode(NotificationCode.MEETING);
            parentNotification.setParent(parent);
            parentNotification.setParentNotificationDate(LocalDate.now());
            parentNotification.setParentNotificationText("상담 예약이 확정되었습니다.");

            parentNotificationRepository.save(parentNotification);
        }

        return confirmMeetings;
    }

    private List<SelectedMeetingDTO> allocateMeetings(List<SelectedMeetingDTO> selectedMeetingDTOs) {
        // 학부모별로 가능한 시간대를 그룹화
        Map<Integer, List<SelectedMeetingDTO>> parentMeetingMap = new HashMap<>();
        for (SelectedMeetingDTO dto : selectedMeetingDTOs) {
            int parentId = dto.getParentId();
            if (!parentMeetingMap.containsKey(parentId)) {
                parentMeetingMap.put(parentId, new ArrayList<>());
            }
            parentMeetingMap.get(parentId).add(dto);
        }

        List<SelectedMeetingDTO> result = new ArrayList<>();
        List<Integer> parentIds = new ArrayList<>(parentMeetingMap.keySet());
        SelectedMeetingDTO[] resultArr = new SelectedMeetingDTO[parentIds.size()];
        SelectedMeetingDTO[] bestResultArr = new SelectedMeetingDTO[parentIds.size()];
        backtrack(parentIds, parentMeetingMap, resultArr, bestResultArr, result, 0, new HashSet<>());

        return result;
    }
    private void backtrack(List<Integer> parentIds, Map<Integer, List<SelectedMeetingDTO>> parentMeetingMap,
                           SelectedMeetingDTO[] resultArr, SelectedMeetingDTO[] bestResultArr, List<SelectedMeetingDTO> result,
                           int index, Set<String> usedSlots) {
        if (flag) return;

        if (index == parentIds.size()) {
            flag = true;
            result.addAll(Arrays.asList(resultArr).subList(0, index));
            return;
        }

        int parentId = parentIds.get(index);
        List<SelectedMeetingDTO> meetings = parentMeetingMap.get(parentId);

        for (SelectedMeetingDTO meeting : meetings) {
            String slot = meeting.getDate() + " " + meeting.getTime();

            if (usedSlots.contains(slot)) continue;

            resultArr[index] = meeting;
            usedSlots.add(slot);
            backtrack(parentIds, parentMeetingMap, resultArr, bestResultArr, result, index + 1, usedSlots);
            usedSlots.remove(slot);
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


    public boolean confirmSubmitStatus(String parentUsername) {
        Parent parent = parentRepository.findByParentUsername(parentUsername);
        return selectedMeetingRepository.existsByParent(parent);
    }
    
    // TODO #1 여기부터 범수 구현
    public List<OptimalMeetingResponseDTO> meetingScheduleListClassifyByAlgorithm(List<SelectedMeetingDTO> selectedMeetingDTOs){
        log.info("meetingScheduleListClassifyByAlgorithm.selectedMeetingDTOs: {}", selectedMeetingDTOs);

        // parentId에 따른 날짜와 시간을 담은 List
        Map<Integer, ArrayList<RequestMeetingTable>> parentMeetingMap = new HashMap<>();

        // 날짜 + 시간을 index로 백트래킹을 진행할 것이기 때문에, 첫 date를 찾음
        // 가장 빠른 예약날짜가 최저 기준
        List<LocalDate> dates = selectedMeetingDTOs.stream()
                .map(SelectedMeetingDTO::getDate)
                .toList();
        LocalDate firstMeetingDate = findFirstDate(dates);

        // 구현에 사용되는 parentId의 리스트
        ArrayList<Integer> parentIds = new ArrayList<>();

        int maxDateIndex = 0;

        for (SelectedMeetingDTO selectedMeetingDTO : selectedMeetingDTOs) {
            int parentId = selectedMeetingDTO.getParentId();
            if (!parentMeetingMap.containsKey(parentId)) {
                parentMeetingMap.put(parentId, new ArrayList<>());
                parentIds.add(parentId);
            }
            RequestMeetingTable requestMeetingTable = new RequestMeetingTable(firstMeetingDate, selectedMeetingDTO.getDate(), selectedMeetingDTO.getTime());
            maxDateIndex = Math.max(maxDateIndex, requestMeetingTable.dateIndex);
            parentMeetingMap.get(parentId).add(requestMeetingTable);
        }

        System.out.println("parentMeetingMap = " + parentMeetingMap);

        // 구현 방식에 따라 변경, 현재 방식은 백트래킹을 통해 구현할 것임
        // 응답 값은 parentId 마다 최적의 Time 반환
        return optimalMeetingImplByBacktracking(parentIds, parentMeetingMap, maxDateIndex, firstMeetingDate);
    }

    // TODO #2 학부모를 안고르는(선택하지않는) 케이스도 구해서 최대 값을 구할 수도 있어야 한다.
    // TODO #2 현재는 무조건 고르는 로직
    private List<OptimalMeetingResponseDTO> optimalMeetingImplByBacktracking(ArrayList<Integer> parentIds, Map<Integer, ArrayList<RequestMeetingTable>> parentMeetingMap, int maxDateIndex, LocalDate baseDate) {
        System.out.println("maxDateIndex = " + maxDateIndex);
        // 날짜, 시간 2차원 배열
        boolean[][] visit = new boolean[maxDateIndex + 1][20];
//        OptimalMeetingResponseDTO[] response = new OptimalMeetingResponseDTO[parentIds.size()];
        
        // response에 저장되는 부분은 각 부모가 선택한 케이스
        int[] response = new int[parentIds.size()];
        Arrays.fill(response, -1);

        if (meetingBacktrackAlgorithm(0, visit, response, parentIds, parentMeetingMap)) {
            System.out.println("Arrays.toString(response) = " + Arrays.toString(response));
            List<OptimalMeetingResponseDTO> optimalMeetingResponseDTOList = new ArrayList<>();
            for (int i = 0; i < response.length; i++) {
                Integer parentId = parentIds.get(i);
                System.out.println("parentMeetingMap.get(parentId) = " + parentMeetingMap.get(parentId));
                RequestMeetingTable requestMeetingTable = parentMeetingMap.get(parentId).get(response[i]);
                LocalDate date = convertIndexToDate(baseDate, requestMeetingTable.dateIndex);
                LocalTime time = convertIndexToTime(requestMeetingTable.timeIndex);
                System.out.println("date = " + date);
                System.out.println("time = " + time);

                OptimalMeetingResponseDTO optimalMeetingResponseDTO = new OptimalMeetingResponseDTO(parentId, date, time);
                optimalMeetingResponseDTOList.add(optimalMeetingResponseDTO);
            }
            return optimalMeetingResponseDTOList;
        }
        return null;
    }

    private boolean meetingBacktrackAlgorithm(int current, boolean[][] visit, int[] response, ArrayList<Integer> parentIds, Map<Integer, ArrayList<RequestMeetingTable>> parentMeetingMap) {
        System.out.println("MeetingTimeService.meetingBacktrackAlgorithm");
        for (int i = 0; i < visit.length; i++) {
            System.out.println("Arrays.toString(visit[i]) = " + Arrays.toString(visit[i]));
        }
        System.out.println("current = " + current);
        if(current == parentIds.size()) {
            // 성공의 케이스 발견
            return true;
        }
        // 우선 current에 맞는 parentMeeting 접근
        List<RequestMeetingTable> meetings = parentMeetingMap.get(parentIds.get(current));
        for (int i = 0; i < meetings.size(); i++) {
            RequestMeetingTable meeting = meetings.get(i);
            if (!visit[meeting.dateIndex][meeting.timeIndex]) {
                visit[meeting.dateIndex][meeting.timeIndex] = true;
                response[current] = i;
                if (meetingBacktrackAlgorithm(current + 1, visit, response, parentIds, parentMeetingMap)) {
                    return true;
                }
                response[current] = -1;
                visit[meeting.dateIndex][meeting.timeIndex] = false;
            }
        }
        return false;
    }

    private int convertDateToIndex(LocalDate baseDate, LocalDate date) {
        return (int) ChronoUnit.DAYS.between(baseDate, date);
    }

    private int convertTimeToIndex(LocalTime time) {
        return (time.getHour() - 9) * 2 + (time.getMinute() / 30);
    }

    private LocalDate convertIndexToDate(LocalDate baseDate, int dateIndex) {
        return baseDate.plusDays(dateIndex);
    }

    private LocalTime convertIndexToTime(int timeIndex) {
        int hour = 9 + (timeIndex / 2);
        int minute = (timeIndex % 2) * 30;
        return LocalTime.of(hour, minute);
    }



    private LocalDate findFirstDate(List<LocalDate> dates) {
        return dates.stream().min(LocalDate::compareTo).orElse(LocalDate.now());
    }

    class RequestMeetingTable {
        int dateIndex;
        int timeIndex;

        RequestMeetingTable(LocalDate firstDate, LocalDate date, String time){
            this.dateIndex = convertDateToIndex(firstDate, date);
            this.timeIndex = convertTimeToIndex(parseTime(time));
        }

        private LocalTime parseTime(String timeString) {
            // H:mm 패턴으로 시간을 파싱합니다.
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("H:mm");
            return LocalTime.parse(timeString, formatter);
        }

        @Override
        public String toString() {
            return "RequestMeetingTable{" +
                    "dateIndex=" + dateIndex +
                    ", timeIndex=" + timeIndex +
                    '}';
        }
    }
    
    // TODO #1 여기까지 범수 구현

}
