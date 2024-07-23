package com.ssafy.kidslink.application.kindergarten.service;

import com.ssafy.kidslink.application.kindergarten.dto.KindergartenDTO;
import com.ssafy.kidslink.application.kindergarten.mapper.KindergartenMapper;
import com.ssafy.kidslink.application.kindergarten.repository.KindergartenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KindergartenService {

    private final KindergartenRepository kindergartenRepository;
    private final KindergartenMapper kindergartenMapper;

    public List<KindergartenDTO> findAll() {
        return kindergartenRepository.findAll().stream()
                .map(kindergartenMapper::toDTO)
                .collect(Collectors.toList());
    }

}
