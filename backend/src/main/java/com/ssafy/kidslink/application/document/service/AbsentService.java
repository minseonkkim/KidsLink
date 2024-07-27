package com.ssafy.kidslink.application.document.service;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.document.domain.Absent;
import com.ssafy.kidslink.application.document.dto.AbsentDTO;
import com.ssafy.kidslink.application.document.mapper.AbsentMapper;
import com.ssafy.kidslink.application.document.repository.AbsentRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.common.enums.ConfirmationStatus;
import com.ssafy.kidslink.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


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
    public List<AbsentDTO> getAllAbsents() {
        List<Absent> absentList = absentRepository.findAll();
        List<AbsentDTO> absentDTOList = new ArrayList<>();

        for (Absent absent : absentList) {
            AbsentDTO dto = absentMapper.toDTO(absent);
            absentDTOList.add(dto);
        }

        return absentDTOList;
    }
    public AbsentDTO getAbsentByAbsentId(int absentId) {
        Optional<Absent> absent = absentRepository.findById(absentId);
        if (absent.isPresent()) {
            return absentMapper.toDTO(absent.get());
        } else {
            throw new ResourceNotFoundException("absent not found with id " + absentId);
        }
    }

    public void updateAbsent(int absentId) {
        Optional<Absent> absentOptional = absentRepository.findById(absentId);

        if (absentOptional.isPresent()) {
            Absent absent = absentOptional.get();
            absent.setConfirmationStatus(ConfirmationStatus.T);
            absentRepository.save(absent);
        } else {
            throw new RuntimeException("Absent not found with id " + absentId);
        }
    }


}
