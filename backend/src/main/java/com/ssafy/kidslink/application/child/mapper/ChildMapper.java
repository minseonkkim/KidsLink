package com.ssafy.kidslink.application.child.mapper;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.child.dto.ChildDTO;
import com.ssafy.kidslink.application.kindergarten.domain.KindergartenClass;
import com.ssafy.kidslink.application.kindergarten.mapper.KindergartenClassMapper;
import com.ssafy.kidslink.application.kindergarten.repository.KindergartenClassRepository;
import com.ssafy.kidslink.common.enums.Gender;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChildMapper {

    private final KindergartenClassRepository kindergartenClassRepository;
    private final KindergartenClassMapper kindergartenClassMapper;

    public Child toEntity(final ChildDTO childDTO) {
        Child child = new Child();
        child.setChildName(childDTO.getName());
        child.setChildGender(Gender.fromCode(childDTO.getGender()));
        child.setChildBirth(child.getChildBirth());

        KindergartenClass kindergartenClass = kindergartenClassMapper.toEntity(childDTO.getKindergartenClass());
        child.setKindergartenClass(kindergartenClass);

        child.setParent(child.getParent());
        child.setChildProfile(childDTO.getProfile());
        return child;
    }

    public ChildDTO toDTO(final Child child) {
        ChildDTO childDTO = new ChildDTO();

        childDTO.setChildId(child.getChildId());
        childDTO.setName(child.getChildName());
        childDTO.setBirth(child.getChildBirth());
        childDTO.setGender(child.getChildGender().getCode());
        childDTO.setKindergartenClass(kindergartenClassMapper.toDTO(child.getKindergartenClass()));
        childDTO.setProfile(child.getChildProfile());
        return childDTO;
    }
}
