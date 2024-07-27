package com.ssafy.kidslink.application.kindergarten.service;

import com.ssafy.kidslink.application.child.dto.ChildDTO;
import com.ssafy.kidslink.application.child.mapper.ChildMapper;
import com.ssafy.kidslink.application.child.repository.ChildRepository;
import com.ssafy.kidslink.application.kindergarten.domain.Kindergarten;
import com.ssafy.kidslink.application.kindergarten.domain.KindergartenClass;
import com.ssafy.kidslink.application.kindergarten.dto.KindergartenClassDTO;
import com.ssafy.kidslink.application.kindergarten.dto.KindergartenDTO;
import com.ssafy.kidslink.application.kindergarten.dto.ResponseClassInfoDTO;
import com.ssafy.kidslink.application.kindergarten.mapper.KindergartenClassMapper;
import com.ssafy.kidslink.application.kindergarten.mapper.KindergartenMapper;
import com.ssafy.kidslink.application.kindergarten.repository.KindergartenClassRepository;
import com.ssafy.kidslink.application.kindergarten.repository.KindergartenRepository;
import com.ssafy.kidslink.application.teacher.dto.TeacherDTO;
import com.ssafy.kidslink.application.teacher.mapper.TeacherMapper;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KindergartenService {

    private final KindergartenRepository kindergartenRepository;
    private final KindergartenMapper kindergartenMapper;
    private final KindergartenClassMapper kindergartenClassMapper;
    private final KindergartenClassRepository kindergartenClassRepository;
    private final TeacherRepository teacherRepository;
    private final ChildRepository childRepository;
    private final TeacherMapper teacherMapper;
    private final ChildMapper childMapper;

    public List<KindergartenDTO> getAll() {
        return kindergartenRepository.findAll().stream()
                .map(kindergartenMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<KindergartenClassDTO> getClasses(Integer kindergartenId) {
        Kindergarten kindergarten = kindergartenRepository.findById(kindergartenId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Kindergarten ID"));

        return kindergarten.getKindergartenClasses().stream()
                .map(kindergartenClassMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ResponseClassInfoDTO getClassInfo(int classId) {
        KindergartenClass kindergartenClass = kindergartenClassRepository.findById(classId).orElseThrow();
        KindergartenClassDTO kindergartenClassDTO = kindergartenClassMapper.toDTO(kindergartenClass);
        TeacherDTO teacher = teacherMapper.toDTO(teacherRepository.findByKindergartenClass(kindergartenClass));
        List<ChildDTO> children = childRepository.findByKindergartenClass(kindergartenClass).stream().map(childMapper::toDTO).collect(Collectors.toList());
        return new ResponseClassInfoDTO(kindergartenClassDTO, teacher, children);
    }
}
