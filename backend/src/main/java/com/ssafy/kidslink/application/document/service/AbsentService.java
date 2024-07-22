package com.ssafy.kidslink.application.document.service;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.document.domain.Absent;
import com.ssafy.kidslink.application.document.dto.AbsentDTO;
import com.ssafy.kidslink.application.document.mapper.AbsentMapper;
import com.ssafy.kidslink.application.document.repository.AbsentRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;


@Service
@Slf4j
@RequiredArgsConstructor
public class AbsentService{
    private final AbsentRepository absentRepository;
    private final AbsentMapper absentMapper;
    private final ParentRepository parentRepository;

    private Parent getParentByUsername(String parentUsername) {
        return parentRepository.findByParentUsername(parentUsername);
    }

    public AbsentDTO createAbsent(String parentUsername,AbsentDTO absentDTO) {
        Parent parent = getParentByUsername(parentUsername);
        Child child = parent.getChildren().iterator().next(); //부모의 첫번째 자식반환. 자식 여러명 확장시 수정필요
        Absent absent = absentMapper.toEntity(absentDTO, child);
        Absent savedAbsent = absentRepository.save(absent);
        return absentMapper.toDTO(savedAbsent);
    }
}
