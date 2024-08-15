package com.ssafy.kidslink.application.kindergarten.mapper;

import com.ssafy.kidslink.application.kindergarten.domain.KindergartenClass;
import com.ssafy.kidslink.application.kindergarten.dto.KindergartenClassDTO;
import com.ssafy.kidslink.application.kindergarten.repository.KindergartenClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KindergartenClassMapper {
    private final KindergartenClassRepository kindergartenClassRepository;
    private final KindergartenMapper kindergartenMapper;

    public KindergartenClass toEntity(KindergartenClassDTO kindergartenClassDTO) {
        return kindergartenClassRepository.findById(kindergartenClassDTO.getKindergartenClassId()).orElseThrow();
    }

    public KindergartenClassDTO toDTO(KindergartenClass kindergartenClass) {
        return new KindergartenClassDTO(kindergartenMapper.toDTO(kindergartenClass.getKindergarten()), kindergartenClass.getKindergartenClassId(), kindergartenClass.getKindergartenClassName());
    }

}
