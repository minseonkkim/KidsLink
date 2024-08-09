package com.ssafy.kidslink.application.bus.service;

import com.ssafy.kidslink.application.bus.domain.Bus;
import com.ssafy.kidslink.application.bus.dto.BusStopDTO;
import com.ssafy.kidslink.application.bus.repository.BusRepository;
import com.ssafy.kidslink.application.bus.domain.BusStop;
import com.ssafy.kidslink.application.bus.repository.BusStopRepository;
import com.ssafy.kidslink.application.bus.domain.BusStopChild;
import com.ssafy.kidslink.application.bus.dto.BusStopChildDTO;
import com.ssafy.kidslink.application.bus.repository.BusStopChildRepository;
import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.child.mapper.ChildMapper;
import com.ssafy.kidslink.application.child.repository.ChildRepository;
import com.ssafy.kidslink.application.kindergarten.domain.Kindergarten;
import com.ssafy.kidslink.application.kindergarten.domain.KindergartenClass;
import com.ssafy.kidslink.application.kindergarten.repository.KindergartenClassRepository;
import com.ssafy.kidslink.application.kindergarten.repository.KindergartenRepository;
import com.ssafy.kidslink.application.notification.domain.ParentNotification;
import com.ssafy.kidslink.application.notification.respository.ParentNotificationRepository;
import com.ssafy.kidslink.application.notification.respository.TeacherNotificationRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import com.ssafy.kidslink.common.enums.BoardingStatus;
import com.ssafy.kidslink.common.enums.NotificationCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BusStopService {
    private final BusStopRepository busStopRepository;
    private final BusStopChildRepository busStopChildRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final TeacherNotificationRepository teacherNotificationRepository;
    private final ParentNotificationRepository parentNotificationRepository;
    private final KindergartenClassRepository kindergartenClassRepository;
    private final ChildRepository childRepository;
    private final KindergartenRepository kindergartenRepository;
    private final BusRepository busRepository;
    private final ChildMapper childMapper;

    public List<BusStop> getAllBusStops() {
        return busStopRepository.findAll();
    }

    public List<BusStopChildDTO> getBusStopChildren(int busStopId) {
        List<BusStopChild> busStopChildList = busStopChildRepository.findByBusStopId(busStopId);
        List<BusStopChildDTO> busStopChildren = new ArrayList<>();

        for(BusStopChild busStopChild : busStopChildList){
            BusStopChildDTO busStopChildDTO = new BusStopChildDTO();

            Child child = busStopChild.getChild();

            busStopChildDTO.setChild(childMapper.toDTO(child));
            busStopChildDTO.setParentTel(child.getParent().getParentTel());
            busStopChildDTO.setStatus(busStopChild.getBusBoardingStatus());

            busStopChildren.add(busStopChildDTO);
        }

        return busStopChildren;
    }

    public void isBoarding(int childId) {
        Child child = childRepository.findById(childId).orElseThrow();
        // 버스 정류장 현재 비즈니스 상 아이당 1개
        BusStopChild busStop = busStopChildRepository.findByChild(child);
        if (busStop.getBusBoardingStatus() == BoardingStatus.F) {
            busStop.setBusBoardingStatus(BoardingStatus.T);
        } else {
            busStop.setBusBoardingStatus(BoardingStatus.F);
        }
        // save == UPDATE
        busStopChildRepository.save(busStop);
    }

    public BusStopChildDTO getBusStopChildByParentUsername(String Username) {
        Parent parent = parentRepository.findByParentUsername(Username);
        // TODO #1 비즈니스 로직상 변경되면 바꿔야 함. 부모(1) - (N)아이 관계
        Child child = parent.getChildren().iterator().next();

        BusStopChildDTO busStopChild = getBusStopChildByChild(child);
        return busStopChild;
    }

    public BusStopChildDTO getBusStopChildByChildId(int childId){
        Child child = childRepository.findById(childId).orElseThrow();

        BusStopChildDTO busStopChild = getBusStopChildByChild(child);
        return busStopChild;
    }


    public BusStopChildDTO getBusStopChildByChild(Child child) {
        BusStopChild busStopChild = busStopChildRepository.findByChild(child);

        BusStopChildDTO busStopChildDTO = new BusStopChildDTO();
        busStopChildDTO.setChild(childMapper.toDTO(child));
        busStopChildDTO.setStatus(busStopChild.getBusBoardingStatus());
        busStopChildDTO.setParentTel(child.getParent().getParentTel());
        return busStopChildDTO;
    }

    public void sendBusNotification(String teacherUsername) {
        Teacher teacher = teacherRepository.findByTeacherUsername(teacherUsername);
        Kindergarten kindergarten = teacher.getKindergartenClass().getKindergarten();
        for (KindergartenClass select : kindergartenClassRepository.findByKindergarten(kindergarten))
            for (Parent parent : parentRepository.findByKindergartenClassId(select.getKindergartenClassId())) {
                ParentNotification parentNotification = new ParentNotification();
                parentNotification.setCode(NotificationCode.BUS);
                parentNotification.setParentNotificationText("버스가 출발하였습니다.");
                parentNotification.setParentNotificationDate(LocalDate.now());
                parentNotification.setParent(parent);
                parentNotificationRepository.save(parentNotification);
            }
    }

    public List<BusStopDTO> getAllBusStopFromKindergarten(int kindergartenId) {
        Kindergarten kindergarten = kindergartenRepository.findById(kindergartenId).orElseThrow();

        Bus bus = busRepository.findByKindergarten(kindergarten);
        List<BusStopDTO> busStopDTOList = new ArrayList<>();
        List<BusStop> busStops = new ArrayList<>(bus.getBusStops());

        busStops = busStops.stream()
                .sorted((a, b) -> Integer.compare(a.getBusStopId(), b.getBusStopId()))
                .toList();

        for (int i = 0; i < busStops.size(); i++) {
            BusStopDTO busStopDTO = new BusStopDTO();
            busStops.get(i).setStopOrder(i + 1);
            busStopDTO.setBusId(bus.getBusId());
            int busStopId = busStops.get(i).getBusStopId();
            busStopDTO.setBusStopId(busStopId);
            busStopDTO.setBusStopName(busStops.get(i).getBusStopName());
            List<BusStopChildDTO> busStopChildren = getBusStopChildren(busStopId);
            busStopDTO.setChildren(busStopChildren);
            busStopDTO.setLatitude(busStops.get(i).getLatitude());
            busStopDTO.setLongitude(busStops.get(i).getLongitude());
            busStopDTOList.add(busStopDTO);
        }
        return busStopDTOList;
    }
}
