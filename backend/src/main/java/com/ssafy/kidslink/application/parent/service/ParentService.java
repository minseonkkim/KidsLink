package com.ssafy.kidslink.application.parent.service;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.child.dto.ChildDTO;
import com.ssafy.kidslink.application.child.repository.ChildRepository;
import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
import com.ssafy.kidslink.application.kindergartenclass.repository.KindergartenClassRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.dto.JoinDTO;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.common.enums.Gender;
import com.ssafy.kidslink.common.exception.PasswordMismatchException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParentService {
    private final ParentRepository parentRepository;
    private final ChildRepository childRepository;
    private final KindergartenClassRepository kindergartenClassRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Transactional
    public void joinProcess(JoinDTO joinDTO) {
        log.info("joinDTO : {}", joinDTO);

        if (!joinDTO.getPassword().equals(joinDTO.getPasswordConfirm())) {
            throw new PasswordMismatchException("비밀번호와 비밀번호 확인이 다릅니다.");
        }

        ChildDTO childDTO = joinDTO.getChild();
        Parent parent = new Parent();
        parent.setParentName(joinDTO.getName());
        parent.setParentEmail(joinDTO.getEmail());
        parent.setParentNickname(joinDTO.getNickname());
        parent.setParentTel(joinDTO.getTel());
        parent.setParentUsername(joinDTO.getUsername());
        parent.setParentPwd(bCryptPasswordEncoder.encode(joinDTO.getPassword()));

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
}
