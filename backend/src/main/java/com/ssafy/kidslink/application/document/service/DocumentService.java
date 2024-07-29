package com.ssafy.kidslink.application.document.service;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.child.repository.ChildRepository;
import com.ssafy.kidslink.application.document.domain.Absent;
import com.ssafy.kidslink.application.document.domain.Dosage;
import com.ssafy.kidslink.application.document.dto.DocumentDTO;
import com.ssafy.kidslink.application.document.mapper.AbsentMapper;
import com.ssafy.kidslink.application.document.mapper.DosageMapper;
import com.ssafy.kidslink.application.document.repository.AbsentRepository;
import com.ssafy.kidslink.application.document.repository.DosageRepository;
import com.ssafy.kidslink.application.kindergarten.domain.KindergartenClass;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import com.ssafy.kidslink.common.dto.User;
import com.ssafy.kidslink.common.util.PrincipalUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final AbsentRepository absentRepository;
    private final DosageRepository dosageRepository;
    private final AbsentMapper absentMapper;
    private final DosageMapper dosageMapper;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final ChildRepository childRepository;

    public List<DocumentDTO> getAllDocuments(Object principal) {
        User user = PrincipalUtils.getUserFromPrincipal(principal);
        String userName = user.getUsername();
        String role = user.getRole();

        Collection<Child> children;
        if(role.equals("ROLE_TEACHER")){
            KindergartenClass kindergartenClass = teacherRepository.findByTeacherUsername(userName).getKindergartenClass();
            children = childRepository.findByKindergartenClass(kindergartenClass);
        }else{
            children = parentRepository.findByParentUsername(userName).getChildren();
        }
        return children.stream()
                .flatMap(child -> getAllDocumentsByChild(child.getChildId()).stream())
                .sorted((d1, d2) -> d1.getDate().compareTo(d2.getDate()))
                .collect(Collectors.toList());
    }

    public List<DocumentDTO> getAllDocumentsByChild(int childId) {
        List<Absent> absents = absentRepository.findByChildChildId(childId);
        List<Dosage> dosages = dosageRepository.findByChildChildId(childId);
        return mergeAndSortDocuments(absents, dosages);
    }

    private List<DocumentDTO> mergeAndSortDocuments(List<Absent> absents, List<Dosage> dosages) {
        List<DocumentDTO> allDocuments = new ArrayList<>();

        for (Absent absent : absents) {
            DocumentDTO document = new DocumentDTO();
            document.setDate(absent.getAbsentStartdate());
            document.setType("Absent");
            document.setAbsent(absentMapper.toDTO(absent));
            allDocuments.add(document);
        }

        for (Dosage dosage : dosages) {
            DocumentDTO document = new DocumentDTO();
            document.setDate(dosage.getDosageStartdate());
            document.setType("Dosage");
            document.setDosage(dosageMapper.toDTO(dosage));
            allDocuments.add(document);
        }

        allDocuments.sort((d1, d2) -> d1.getDate().compareTo(d2.getDate()));
        return allDocuments;
    }

}
