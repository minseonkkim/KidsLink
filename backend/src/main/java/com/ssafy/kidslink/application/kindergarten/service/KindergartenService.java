package com.ssafy.kidslink.application.kindergarten.service;

import com.ssafy.kidslink.application.kindergarten.domain.Kindergarten;
import com.ssafy.kidslink.application.kindergarten.dto.KindergartenDTO;
import com.ssafy.kidslink.application.kindergarten.mapper.KindergartenMapper;
import com.ssafy.kidslink.application.kindergarten.repository.KindergartenRepository;
import com.ssafy.kidslink.application.kindergartenclass.dto.KindergartenClassDTO;
import com.ssafy.kidslink.application.kindergartenclass.mapper.KindergartenClassMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KindergartenService {

    private final KindergartenRepository kindergartenRepository;
    private final KindergartenMapper kindergartenMapper;
    private final KindergartenClassMapper kindergartenClassMapper;

    public List<KindergartenDTO> getAll() {
        return kindergartenRepository.findAll().stream()
                .map(kindergartenMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<KindergartenClassDTO> getClasses(Integer kindergartenId) {
        Kindergarten kindergarten = kindergartenRepository.findById(kindergartenId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Kindergarten ID"));

        return kindergarten.getKindergartenClasses().stream()
                .map(kindergartenClassMapper::toDTO)
                .collect(Collectors.toList());
    }

}
