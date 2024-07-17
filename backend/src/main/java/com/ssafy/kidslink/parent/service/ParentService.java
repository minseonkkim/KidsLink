package com.ssafy.kidslink.parent.service;

import com.ssafy.kidslink.child.domain.Child;
import com.ssafy.kidslink.child.dto.ChildDTO;
import com.ssafy.kidslink.child.repository.ChildRepository;
import com.ssafy.kidslink.exception.PasswordMismatchException;
import com.ssafy.kidslink.parent.domain.Parent;
import com.ssafy.kidslink.parent.dto.JoinDTO;
import com.ssafy.kidslink.parent.repository.ParentRepository;
import com.ssafy.kidslink.util.Gender;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ParentService {
    private final ParentRepository parentRepository;
    private final ChildRepository childRepository;

    /**
     * TODO #1 setKindergartenId 부분 Kindergarten 이름으로 ID 찾아오기
     */
    public void joinProcess(JoinDTO joinDTO) {
        if (!joinDTO.getPassword().equals(joinDTO.getPasswordConfirm())) {
            throw new PasswordMismatchException("비밀번호와 비밀번호 확인이 다릅니다.");
        }

        ChildDTO childDTO = joinDTO.getChildDTO();
        Parent parent = new Parent();
        parent.setParentName(joinDTO.getName());
        parent.setParentEmail(joinDTO.getEmail());
        parent.setParentNickname(joinDTO.getNickname());
        parent.setParentTel(joinDTO.getTel());
        parent.setParentUsername(joinDTO.getUsername());
        parent.setParentPwd(joinDTO.getPassword());

        Parent savedParent = parentRepository.save(parent);

        Child child = new Child();
        if (childDTO.getGender().equals("M")) {
            child.setChildGender(Gender.M);
        } else {
            child.setChildGender(Gender.F);
        }
        child.setChildName(childDTO.getName());
        child.setChildBirth(childDTO.getBirth());

        // TODO #2 수정 바람 (도메인 자체를 연결)
        child.setParentId(savedParent.getParentId());
        child.setKindergartenClassId(1);
        child.setKindergartenId(1);

        childRepository.save(child);
    }

}
