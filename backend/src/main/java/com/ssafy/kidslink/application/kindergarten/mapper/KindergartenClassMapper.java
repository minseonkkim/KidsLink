package com.ssafy.kidslink.application.kindergartenclass.mapper;

import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
import com.ssafy.kidslink.application.kindergartenclass.dto.KindergartenClassDTO;
import com.ssafy.kidslink.application.kindergartenclass.repository.KindergartenClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KindergartenClassMapper {
    private final KindergartenClassRepository kindergartenClassRepository;
    public KindergartenClass toEntity(KindergartenClassDTO kindergartenClassDTO) {
        return kindergartenClassRepository.findById(kindergartenClassDTO.getKindergartenClassId()).orElseThrow();
    }

    public KindergartenClassDTO toDTO(KindergartenClass kindergartenClass) {
        return new KindergartenClassDTO(kindergartenClass.getKindergartenClassId(), kindergartenClass.getKindergartenClassName());
    }
}
