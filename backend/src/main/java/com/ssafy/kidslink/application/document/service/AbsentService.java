package com.ssafy.kidslink.application.document.service;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.child.repository.ChildRepository;
import com.ssafy.kidslink.application.document.domain.Absent;
import com.ssafy.kidslink.application.document.dto.AbsentDTO;
import com.ssafy.kidslink.application.document.mapper.AbsentMapper;
import com.ssafy.kidslink.application.document.repository.AbsentRepository;
import com.ssafy.kidslink.application.notification.domain.TeacherNotification;
import com.ssafy.kidslink.application.notification.respository.TeacherNotificationRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import com.ssafy.kidslink.common.dto.User;
import com.ssafy.kidslink.common.enums.ConfirmationStatus;
import com.ssafy.kidslink.common.enums.NotificationCode;
import com.ssafy.kidslink.common.exception.ResourceNotFoundException;
import com.ssafy.kidslink.common.util.PrincipalUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@Slf4j
@RequiredArgsConstructor
public class AbsentService{
    private final AbsentRepository absentRepository;
    private final AbsentMapper absentMapper;
    private final ParentRepository parentRepository;
    private final TeacherNotificationRepository teacherNotificationRepository;
    private final TeacherRepository teacherRepository;
    private final ChildRepository childRepository;

    private Parent getParentByUsername(String parentUsername) {
        return parentRepository.findByParentUsername(parentUsername);
    }
    @Transactional
    public void createAbsent(int childId,AbsentDTO absentDTO) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new IllegalArgumentException("Child not found with id " + childId));
        Absent absent = absentMapper.toEntity(absentDTO, child);
        Absent savedAbsent = absentRepository.save(absent);

        TeacherNotification teacherNotification = new TeacherNotification();
        teacherNotification.setCode(NotificationCode.DOCUMENT);
        teacherNotification.setTeacherNotificationDate(LocalDate.now());
        teacherNotification.setTeacher(teacherRepository.findByKindergartenClass(child.getKindergartenClass()));
        teacherNotification.setTeacherNotificationText("새로운 결석 서류가 등록되었습니다.");
        teacherNotificationRepository.save(teacherNotification);

        absentMapper.toDTO(savedAbsent);
    }
    public List<AbsentDTO> getAllAbsents() {
        return absentRepository.findAll().stream()
                .map(absentMapper::toDTO)
                .collect(Collectors.toList());
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
