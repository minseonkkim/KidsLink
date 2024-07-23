package com.ssafy.kidslink.common.service;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.child.repository.ChildRepository;
import com.ssafy.kidslink.application.kindergarten.domain.Kindergarten;
import com.ssafy.kidslink.application.kindergarten.repository.KindergartenRepository;
import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
import com.ssafy.kidslink.application.kindergartenclass.repository.KindergartenClassRepository;
import com.ssafy.kidslink.application.noticeboard.domain.NoticeBoard;
import com.ssafy.kidslink.application.noticeboard.repository.NoticeBoardRepository;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.application.parent.repository.ParentRepository;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import com.ssafy.kidslink.application.teacher.repository.TeacherRepository;
import com.ssafy.kidslink.common.enums.Gender;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
    private final ChildRepository childRepository;
    private final NoticeBoardRepository noticeBoardRepository;

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
        List<Parent> parents = getParents();
        parentRepository.saveAll(parents);

        // TODO #4 선생님 데이터 삽입
        teacherRepository.saveAll(getTeachers(kindergartenClasses));

        // TODO #5 유치원생 데이터 삽입
        childRepository.saveAll(getChildren(parents, kindergartenClasses));

        // TODO #6 알림장 데이터 삽입
        noticeBoardRepository.saveAll(getNoticeBoards(kindergartenClasses.get(0)));

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
        noticeBoardRepository.deleteAll();
        childRepository.deleteAll();
        parentRepository.deleteAll();
        teacherRepository.deleteAll();
        kindergartenClassRepository.deleteAll();
        kindergartenRepository.deleteAll();
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

    private List<Child> getChildren(List<Parent> parents, List<KindergartenClass> kindergartenClasses) {
        List<Child> children = new ArrayList<>();
        String[] childNames = {"김하늘", "이민호", "박서연", "최우진", "장예빈", "강지후", "오수아", "윤도현", "정수지", "한지우"};
        Gender[] genders = {Gender.F, Gender.M, Gender.F, Gender.M, Gender.F, Gender.M, Gender.F, Gender.M, Gender.F, Gender.F};
        String[] births = {"2015-05-01", "2016-08-15", "2014-11-20", "2015-01-30", "2016-02-14", "2015-07-07", "2016-09-09", "2014-12-25", "2015-04-04", "2016-03-03"};
//        String[] profiles = {"child1.jpg", "child2.jpg", "child3.jpg", "child4.jpg", "child5.jpg", "child6.jpg", "child7.jpg", "child8.jpg", "child9.jpg", "child10.jpg"};

        for (int i = 0; i < parents.size(); i++) {
            Child child = new Child();
            child.setChildName(childNames[i]);
            child.setChildGender(genders[i]);
            child.setChildBirth(births[i]);
//            child.setChildProfile(profiles[i]);
            child.setParent(parents.get(i));
            child.setKindergartenClass(kindergartenClasses.get(i % kindergartenClasses.size())); // 유치원 반을 순환하며 할당
            children.add(child);
        }

        return children;
    }

    private List<NoticeBoard> getNoticeBoards(KindergartenClass kindergartenClass) {
        List<NoticeBoard> noticeBoards = new ArrayList<>();
        String[] titles = {"유치원 행사 안내", "여름 방학 일정", "가을 소풍 안내", "학부모 상담 일정", "어린이날 행사"};
        String[] contents = {
                "다음 주에는 유치원에서 작은 행사가 열립니다. 많은 참여 부탁드립니다.",
                "이번 여름 방학 일정은 7월 20일부터 8월 20일까지입니다.",
                "가을 소풍은 10월 첫째 주에 진행됩니다. 자세한 사항은 추후 공지하겠습니다.",
                "학부모 상담 일정이 잡혔습니다. 각 반별로 시간표를 확인해 주세요.",
                "어린이날을 맞아 다양한 행사가 준비되어 있습니다. 많은 참여 바랍니다."
        };

        for (int i = 0; i < titles.length; i++) {
            NoticeBoard noticeBoard = new NoticeBoard();
            noticeBoard.setNoticeBoardTitle(titles[i]);
            noticeBoard.setNoticeBoardContent(contents[i]);
            noticeBoard.setNoticeBoardDate(LocalDate.now().plusDays(i));
            noticeBoard.setKindergartenClass(kindergartenClass); // 유치원 반을 순환하며 할당
            noticeBoards.add(noticeBoard);
        }

        return noticeBoards;
    }

}
