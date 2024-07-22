package com.ssafy.kidslink.application.document.service;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.document.domain.Absent;
import com.ssafy.kidslink.application.document.domain.Dosage;
import com.ssafy.kidslink.application.document.dto.AbsentDTO;
import com.ssafy.kidslink.application.document.dto.DosageDTO;
import com.ssafy.kidslink.application.document.mapper.DosageMapper;
import com.ssafy.kidslink.application.document.repository.DosageRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class DosageService {
    private final ParentRepository parentRepository;
    private final DosageMapper dosageMapper;
    private final DosageRepository dosageRepository;
    private Parent getParentByUsername(String parentUsername) {
        return parentRepository.findByParentUsername(parentUsername);
    }
    public DosageDTO createDosage(String parentUsername, DosageDTO dosageDTO) {
        Parent parent = getParentByUsername(parentUsername);
        Child child = parent.getChildren().iterator().next(); //부모의 첫번째 자식반환. 자식 여러명 확장시 수정필요
        Dosage dosage = dosageMapper.toEntity(dosageDTO, child);
        Dosage savedDosage = dosageRepository.save(dosage);
        return dosageMapper.toDTO(savedDosage);
    }
}
