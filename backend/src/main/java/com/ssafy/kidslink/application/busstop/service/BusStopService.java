package com.ssafy.kidslink.application.busstop.service;

import com.ssafy.kidslink.application.busstop.domain.BusStop;
import com.ssafy.kidslink.application.busstop.repository.BusStopRepository;
import com.ssafy.kidslink.application.busstopchild.domain.BusStopChild;
import com.ssafy.kidslink.application.busstopchild.dto.BusStopChildDTO;
import com.ssafy.kidslink.application.busstopchild.repository.BusStopChildRepository;
import com.ssafy.kidslink.application.child.repository.ChildRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.ssafy.kidslink.application.busstopchild.domain.BusStopChild.BoardingStatus.F;

@Service
@RequiredArgsConstructor
@Slf4j
public class BusStopService {
    private final BusStopRepository busStopRepository;
    private final BusStopChildRepository busStopChildRepository;
    private final ChildRepository childRepository;

    public List<BusStop> getAllBusStops() {
        return busStopRepository.findAll();
    }

    public List<BusStopChildDTO> getBusStopChildren(int busStopId) {
        List<BusStopChild> busStopChildList = busStopChildRepository.findByBusStopId(busStopId);
        List<BusStopChildDTO> busStopChildren = new ArrayList<>();

        for(BusStopChild busStopChild : busStopChildList.stream().toList()){
            BusStopChildDTO busStopChildDTO = new BusStopChildDTO();

            busStopChildDTO.setChildName(busStopChild.getChild().getChildName());
            busStopChildDTO.setParentTel(busStopChild.getChild().getParent().getParentTel());
            busStopChildDTO.setStatus(busStopChild.getBusBoardingStatus());

            busStopChildren.add(busStopChildDTO);
        }

         return busStopChildren;

    }

    public void isBoarding(int childId){
        busStopChildRepository.updateBoardingStatus(childId, F);
    }
}
