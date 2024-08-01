package com.ssafy.kidslink.application.parent.service;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.child.dto.ChildDTO;
import com.ssafy.kidslink.application.child.dto.JoinChildDTO;
import com.ssafy.kidslink.application.child.mapper.ChildMapper;
import com.ssafy.kidslink.application.child.repository.ChildRepository;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import com.ssafy.kidslink.application.image.service.ImageService;
import com.ssafy.kidslink.application.kindergarten.domain.KindergartenClass;
import com.ssafy.kidslink.application.kindergarten.mapper.KindergartenClassMapper;
import com.ssafy.kidslink.application.kindergarten.repository.KindergartenClassRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.dto.ParentDTO;
import com.ssafy.kidslink.application.parent.dto.ParentJoinDTO;
import com.ssafy.kidslink.application.parent.mapper.ParentMapper;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.teacher.dto.TeacherDTO;
import com.ssafy.kidslink.application.teacher.mapper.TeacherMapper;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import com.ssafy.kidslink.common.enums.Gender;
import com.ssafy.kidslink.common.exception.PasswordMismatchException;
import com.ssafy.kidslink.common.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParentService {
    private final ParentRepository parentRepository;
    private final TeacherRepository teacherRepository;
    private final ChildRepository childRepository;
    private final KindergartenClassRepository kindergartenClassRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ImageService imageService;
    private final UserService userService;
    private final ChildMapper childMapper;
    private final ParentMapper parentMapper;
    private final TeacherMapper teacherMapper;
    private final KindergartenClassMapper kindergartenClassMapper;

    @Transactional
    public void joinProcess(ParentJoinDTO joinDTO) {
        log.debug("joinDTO : {}", joinDTO);

        if (userService.isExistUser(joinDTO.getUsername())) {
            throw new RuntimeException("이미 존재하는 아이디 입니다.");
        }

        if (joinDTO.getPassword() == null || !joinDTO.getPassword().equals(joinDTO.getPasswordConfirm())) {
            throw new PasswordMismatchException("비밀번호와 비밀번호 확인이 다릅니다.");
        }
        ImageDTO imageDTO = new ImageDTO();
        if (joinDTO.getProfile() != null) {
            try {
                imageDTO = imageService.storeFile(joinDTO.getProfile());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        JoinChildDTO childDTO = joinDTO.getChild();
        Parent parent = new Parent();
        parent.setParentName(joinDTO.getName());
        parent.setParentEmail(joinDTO.getEmail());
        parent.setParentNickname(joinDTO.getNickname());
        parent.setParentTel(joinDTO.getTel());
        parent.setParentUsername(joinDTO.getUsername());
        parent.setParentPassword(bCryptPasswordEncoder.encode(joinDTO.getPassword()));
        parent.setParentProfile(imageDTO.getPath());
        Parent savedParent = parentRepository.save(parent);

        Child child = new Child();
        child.setChildGender(Gender.fromCode(childDTO.getGender()));
        child.setChildName(childDTO.getName());
        child.setChildBirth(childDTO.getBirth());
        if (joinDTO.getChildProfile() != null) {
            log.info("childDTO.getChildProfile success");
            try {
                ImageDTO childImageDTO = imageService.storeFile(joinDTO.getChildProfile());
                child.setChildProfile(childImageDTO.getPath());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        KindergartenClass kindergartenClass = kindergartenClassRepository.findById(childDTO.getKindergartenClassId()).orElseThrow();

        child.setParent(savedParent);
        child.setKindergartenClass(kindergartenClass);

        childRepository.save(child);
    }

    public ParentDTO getDetailByUsername(String username) {
        return parentMapper.toDTO(parentRepository.findByParentUsername(username));
    }

    public Set<ChildDTO> getMyChildren(String username) {
        return parentRepository.findByParentUsername(username)
                .getChildren()
                .stream()
                .map(childMapper::toDTO)
                .collect(Collectors.toSet());
    }

    public ParentDTO getDetailByParentId(int parentId) {
        return parentMapper.toDTO(parentRepository.findById(parentId).orElseThrow(IllegalArgumentException::new));
    }

    public TeacherDTO getTeacherByParentId(int parentId) {
        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid parent Id:" + parentId));

        // Assuming the parent has only one child for simplicity
        Child child = parent.getChildren().iterator().next();
        KindergartenClass kindergartenClass = child.getKindergartenClass();
        TeacherDTO teacherDTO = teacherMapper.toDTO(teacherRepository.findByKindergartenClass(kindergartenClass));

        return teacherDTO;
    }
}
