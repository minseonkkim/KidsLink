package com.ssafy.kidslink.application.child.service;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.child.dto.ChildDTO;
import com.ssafy.kidslink.application.child.mapper.ChildMapper;
import com.ssafy.kidslink.application.child.repository.ChildRepository;
import com.ssafy.kidslink.application.kindergarten.domain.KindergartenClass;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChildService {
    private final ChildRepository childRepository;
    private final ChildMapper childMapper;

    public ChildDTO getChildInfo(int childId){
        return childMapper.toDTO(childRepository.findById(childId).orElseThrow());
    }

    public List<Child> findChildrenByKindergartenClass(KindergartenClass kindergartenClass) {
        return childRepository.findByKindergartenClass(kindergartenClass);
    }
}
