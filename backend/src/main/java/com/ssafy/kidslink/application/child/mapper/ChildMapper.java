package com.ssafy.kidslink.application.child.mapper;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.child.dto.ChildDTO;
import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
import com.ssafy.kidslink.application.kindergartenclass.repository.KindergartenClassRepository;
import com.ssafy.kidslink.common.enums.Gender;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChildMapper {

    private final KindergartenClassRepository kindergartenClassRepository;

    public Child toEntity(final ChildDTO childDTO) {
        Child child = new Child();
        child.setChildName(childDTO.getName());
        child.setChildGender(Gender.fromCode(childDTO.getGender()));
        child.setChildBirth(child.getChildBirth());

        KindergartenClass kindergartenClass = kindergartenClassRepository.findByKindergartenKindergartenNameAndKindergartenClassName(childDTO.getKindergartenName(), childDTO.getKindergartenClassName());
        child.setKindergartenClass(kindergartenClass);

        child.setParent(child.getParent());
        child.setChildProfile(childDTO.getProfile());
        return child;
    }

    public ChildDTO toDTO(final Child child) {
        ChildDTO childDTO = new ChildDTO();

        childDTO.setName(child.getChildName());
        childDTO.setBirth(child.getChildBirth());
        childDTO.setGender(child.getChildGender().getCode());
        childDTO.setKindergartenName(child.getKindergartenClass().getKindergarten().getKindergartenName());
        childDTO.setKindergartenClassName(child.getKindergartenClass().getKindergartenClassName());
        childDTO.setProfile(child.getChildProfile());
        return childDTO;
    }
}
