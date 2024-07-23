package com.ssafy.kidslink.common.service;

import com.ssafy.kidslink.application.kindergarten.domain.Kindergarten;
import com.ssafy.kidslink.application.kindergarten.repository.KindergartenRepository;
import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
import com.ssafy.kidslink.application.kindergartenclass.repository.KindergartenClassRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InitialDataService {

    private final KindergartenRepository kindergartenRepository;
    private final KindergartenClassRepository kindergartenClassRepository;
    private final ParentRepository parentRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final TeacherRepository teacherRepository;

    @Transactional
    public String initializeData() {
        deleteAll();

        // TODO #1 유치원 초기 데이터 삽입
        List<Kindergarten> kindergartens = getKindergartens();
        kindergartenRepository.saveAll(kindergartens);

        // TODO #2 유치원 반 초기 데이터 삽입
        // 각 유치원에 3개의 반을 추가
        List<KindergartenClass> kindergartenClasses = getKindergartenClasses(kindergartens);
        kindergartenClassRepository.saveAll(kindergartenClasses);

        // TODO #3 부모님 데이터 삽입
        parentRepository.saveAll(getParents());

        // TODO #4 선생님 데이터 삽입
        teacherRepository.saveAll(getTeachers(kindergartenClasses));

        // TODO #5 유치원생 데이터 삽입

        // TODO #6 알림장 데이터 삽입

        // TODO #7 성장일지 데이터 삽입

        // TODO #8 투약 관련 데이터 삽입

        // TODO #9 결석 관련 데이터 삽입

        // TODO #10 버스 정류장 데이터 삽입

        // TODO #11 버스 정류장에 아이 데이터 삽입

        return "데이터 세팅 성공";
    }

    private List<Kindergarten> getKindergartens() {
        return getKindergartenNames().stream()
                .map(name -> {
                    Kindergarten kindergarten = new Kindergarten();
                    kindergarten.setKindergartenName(name);
                    return kindergarten;
                })
                .collect(Collectors.toList());
    }

    private static List<KindergartenClass> getKindergartenClasses(List<Kindergarten> kindergartens) {
        return kindergartens.stream()
                .flatMap(kindergarten -> getKindergartenClassNames().stream()
                        .limit(3)
                        .map(className -> {
                            KindergartenClass kindergartenClass = new KindergartenClass();
                            kindergartenClass.setKindergartenId(kindergarten.getKindergartenId());
                            kindergartenClass.setKindergartenClassName(className);
                            return kindergartenClass;
                        }))
                .collect(Collectors.toList());
    }

    private void deleteAll(){
        kindergartenRepository.deleteAll();
        kindergartenClassRepository.deleteAll();
        parentRepository.deleteAll();
        teacherRepository.deleteAll();
    }

    private static List<String> getKindergartenClassNames() {
        return Arrays.asList(
                "햇살반", "별빛반", "꿈나무반", "푸른숲반", "행복반",
                "사랑반", "하늘반", "바다반", "무지개반", "한울반",
                "동그라미반", "달님반", "솔잎반", "별나라반", "참나무반",
                "아름반", "솔바람반", "열매반", "다정반", "예쁜반"
        );
    }


    private List<String> getKindergartenNames() {
        return Arrays.asList("햇살 유치원", "별빛 유치원", "꿈나무 유치원", "푸른숲 유치원", "행복한 유치원", "사랑 유치원", "하늘 유치원"
                , "바다 유치원", "무지개 유치원", "한울 유치원", "동그라미 유치원", "달님 유치원", "솔잎 유치원", "별나라 유치원", "참나무 유치원",
                "아름 유치원", "솔바람 유치원", "열매 유치원", "다정 유치원", "예쁜 유치원"
        );
    }

    private List<Parent> getParents() {
        List<Parent> parents = new ArrayList<>();
        String[] usernames = {"parent1", "parent2", "parent3", "parent4", "parent5", "parent6", "parent7", "parent8", "parent9", "parent10"};
        String[] names = {"김철수", "이영희", "박민수", "최수영", "장준호", "강현우", "오세영", "윤지현", "정우성", "한지민"};
        String[] passwords = {"parent1", "parent2", "parent3", "parent4", "parent5", "parent6", "parent7", "parent8", "parent9", "parent10"};
        String[] nicknames = {"철수아빠", "영희엄마", "민수아빠", "수영엄마", "준호아빠", "현우엄마", "세영아빠", "지현엄마", "우성아빠", "지민엄마"};
        String[] tels = {"010-1111-1111", "010-2222-2222", "010-3333-3333", "010-4444-4444", "010-5555-5555", "010-6666-6666", "010-7777-7777", "010-8888-8888", "010-9999-9999", "010-1010-1010"};
        String[] emails = {"user1@example.com", "user2@example.com", "user3@example.com", "user4@example.com", "user5@example.com", "user6@example.com", "user7@example.com", "user8@example.com", "user9@example.com", "user10@example.com"};

        for (int i = 0; i < usernames.length; i++) {
            Parent parent = new Parent();
            parent.setParentUsername(usernames[i]);
            parent.setParentName(names[i]);
            parent.setParentPassword(bCryptPasswordEncoder.encode(passwords[i]));
            parent.setParentNickname(nicknames[i]);
            parent.setParentTel(tels[i]);
            parent.setParentEmail(emails[i]);
            parents.add(parent);
        }

        return parents;
    }

    private List<Teacher> getTeachers(List<KindergartenClass> kindergartenClasses) {
        List<Teacher> teachers = new ArrayList<>();
        String[] usernames = {"teacher1", "teacher2", "teacher3", "teacher4", "teacher5", "teacher6", "teacher7", "teacher8", "teacher9", "teacher10"};
        String[] names = {"최민호", "박지수", "이준혁", "김소연", "한동훈", "장수진", "홍길동", "서윤아", "조민기", "송지호"};
        String[] passwords = {"teacher1", "teacher2", "teacher3", "teacher4", "teacher5", "teacher6", "teacher7", "teacher8", "teacher9", "teacher10"};
        String[] nicknames = {"민호쌤", "지수쌤", "준혁쌤", "소연쌤", "동훈쌤", "수진쌤", "길동쌤", "윤아쌤", "민기쌤", "지호쌤"};
        String[] tels = {"010-1111-1111", "010-2222-2222", "010-3333-3333", "010-4444-4444", "010-5555-5555", "010-6666-6666", "010-7777-7777", "010-8888-8888", "010-9999-9999", "010-1010-1010"};
        String[] emails = {"user1@example.com", "user2@example.com", "user3@example.com", "user4@example.com", "user5@example.com", "user6@example.com", "user7@example.com", "user8@example.com", "user9@example.com", "user10@example.com"};

        for (int i = 0; i < usernames.length; i++) {
            Teacher teacher = new Teacher();
            teacher.setTeacherUsername(usernames[i]);
            teacher.setTeacherName(names[i]);
            teacher.setTeacherPassword(bCryptPasswordEncoder.encode(passwords[i]));
            teacher.setTeacherNickname(nicknames[i]);
            teacher.setTeacherTel(tels[i]);
            teacher.setTeacherEmail(emails[i]);
            teacher.setKindergartenClass(kindergartenClasses.get(i));
            teachers.add(teacher);
        }

        return teachers;
    }

}
