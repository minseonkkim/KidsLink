package com.ssafy.kidslink.application.bus.service;

import com.ssafy.kidslink.application.bus.domain.Bus;
import com.ssafy.kidslink.application.bus.domain.BusStop;
import com.ssafy.kidslink.application.bus.repository.BusRepository;
import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.kindergarten.domain.Kindergarten;
import com.ssafy.kidslink.application.kindergarten.domain.KindergartenClass;
import com.ssafy.kidslink.application.kindergarten.dto.ResponseClassInfoDTO;
import com.ssafy.kidslink.application.kindergarten.repository.KindergartenClassRepository;
import com.ssafy.kidslink.application.kindergarten.repository.KindergartenRepository;
import com.ssafy.kidslink.application.kindergarten.service.KindergartenService;
import com.ssafy.kidslink.application.notification.domain.ParentNotification;
import com.ssafy.kidslink.application.notification.respository.ParentNotificationRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.common.enums.NotificationCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class BusService {
    private final BusRepository busRepository;
    private final ParentRepository parentRepository;
    private final ParentNotificationRepository parentNotificationRepository;

    public void sendBusNotification(int busId) {
        Bus bus = busRepository.findById(busId).orElseThrow();

        Set<BusStop> busStops = bus.getBusStops();
        for (BusStop busStop : busStops) {
            List<Child> children = busStop.getChildren();
            for (Child child : children) {
                ParentNotification parentNotification = new ParentNotification();
                parentNotification.setCode(NotificationCode.BUS);
                parentNotification.setParentNotificationText("버스가 출발하였습니다.");
                parentNotification.setParentNotificationDate(LocalDate.now());
                parentNotification.setParent(child.getParent());
                parentNotificationRepository.save(parentNotification);
            }
        }
    }
}
