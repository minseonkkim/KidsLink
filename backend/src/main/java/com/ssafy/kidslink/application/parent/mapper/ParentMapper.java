package com.ssafy.kidslink.application.parent.mapper;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.child.mapper.ChildMapper;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.dto.ParentDTO;
import com.ssafy.kidslink.application.parent.dto.ParentIdDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Iterator;
import java.util.Set;

@Component
@Slf4j
@RequiredArgsConstructor
public class ParentMapper {

    private final ChildMapper childMapper;

    public Parent toEntity(ParentDTO parentDTO) {
        Parent parent = new Parent();
        parent.setParentUsername(parentDTO.getUsername());
        parent.setParentEmail(parentDTO.getEmail());
        parent.setParentName(parentDTO.getName());
        parent.setParentNickname(parentDTO.getNickname());
        parent.setParentTel(parentDTO.getTel());
        Child child = childMapper.toEntity(parentDTO.getChild());
        parent.setChildren(Set.of(child));
        parent.setParentProfile(parentDTO.getProfile());

        return parent;
    }

    /**
     * TODO #1 Child 요구사항이 커지면 iterator 수정
     */
    public ParentDTO toDTO(Parent parent) {
        ParentDTO parentDTO = new ParentDTO();
        parentDTO.setUsername(parent.getParentUsername());
        parentDTO.setEmail(parent.getParentEmail());
        parentDTO.setName(parent.getParentName());
        parentDTO.setNickname(parent.getParentNickname());
        parentDTO.setTel(parent.getParentTel());

        Set<Child> children = parent.getChildren();
        Iterator<Child> iterator = children.iterator();
        if (iterator.hasNext()) {
            Child child = iterator.next();
            parentDTO.setChild(childMapper.toDTO(child));
        }
        parentDTO.setProfile(parent.getParentProfile());

        return parentDTO;
    }
    public ParentIdDTO parentIdToDTO(Parent parent) {
        ParentIdDTO parentIdDTO = new ParentIdDTO();
        parentIdDTO.setParentId(parentIdDTO.getParentId());
        parentIdDTO.setUsername(parent.getParentUsername());
        parentIdDTO.setEmail(parent.getParentEmail());
        parentIdDTO.setName(parent.getParentName());
        parentIdDTO.setNickname(parent.getParentNickname());
        parentIdDTO.setTel(parent.getParentTel());

        Set<Child> children = parent.getChildren();
        Iterator<Child> iterator = children.iterator();
        if (iterator.hasNext()) {
            Child child = iterator.next();
            parentIdDTO.setChild(childMapper.toDTO(child));
        }
        parentIdDTO.setProfile(parent.getParentProfile());

        return parentIdDTO;
    }
}
