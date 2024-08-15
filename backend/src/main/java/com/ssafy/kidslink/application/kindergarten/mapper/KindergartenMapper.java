package com.ssafy.kidslink.application.kindergarten.mapper;

import com.ssafy.kidslink.application.kindergarten.domain.Kindergarten;
import com.ssafy.kidslink.application.kindergarten.dto.KindergartenDTO;
import org.springframework.stereotype.Component;

@Component
public class KindergartenMapper {

    public Kindergarten toEntity(KindergartenDTO kindergartenDTO) {
        Kindergarten kindergarten = new Kindergarten();
        kindergarten.setKindergartenName(kindergartenDTO.getKindergartenName());
        kindergarten.setKindergartenId(kindergartenDTO.getKindergartenId());
        return kindergarten;
    }

    public KindergartenDTO toDTO(Kindergarten kindergarten) {
        return new KindergartenDTO(kindergarten.getKindergartenId(), kindergarten.getKindergartenName());
    }

}
