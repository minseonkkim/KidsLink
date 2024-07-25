package com.ssafy.kidslink.application.parent.service;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.child.dto.ChildDTO;
import com.ssafy.kidslink.application.child.mapper.ChildMapper;
import com.ssafy.kidslink.application.child.repository.ChildRepository;
import com.ssafy.kidslink.application.image.dto.ImageDTO;
import com.ssafy.kidslink.application.image.service.ImageService;
import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
import com.ssafy.kidslink.application.kindergartenclass.repository.KindergartenClassRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.dto.JoinDTO;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
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

    @Transactional
    public void joinProcess(JoinDTO joinDTO) {
        log.info("joinDTO : {}", joinDTO);

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

        ChildDTO childDTO = joinDTO.getChild();
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

        KindergartenClass kindergartenClass =
                kindergartenClassRepository
                        .findByKindergartenKindergartenNameAndKindergartenClassName(
                                childDTO.getKindergartenName(), childDTO.getKindergartenClassName()
                        );

        child.setParent(savedParent);
        child.setKindergartenClass(kindergartenClass);

        childRepository.save(child);
    }

    public Parent getDetailByUsername(String username) {
        return parentRepository.findByParentUsername(username);
    }

    public Set<ChildDTO> getMyChildren(String username) {
        return parentRepository.findByParentUsername(username)
                .getChildren()
                .stream()
                .map(childMapper::toDTO)
                .collect(Collectors.toSet());
    }
}
