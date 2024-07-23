package com.ssafy.kidslink.common.service;

import com.ssafy.kidslink.application.kindergarten.domain.Kindergarten;
import com.ssafy.kidslink.application.kindergarten.repository.KindergartenRepository;
import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
import com.ssafy.kidslink.application.kindergartenclass.repository.KindergartenClassRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InitialDataService {

    private final KindergartenRepository kindergartenRepository;
    private final KindergartenClassRepository kindergartenClassRepository;

    @Transactional
    public String initializeData() {
        // TODO #1 유치원 초기 데이터 삽입
        List<Kindergarten> kindergartens = getKindergartenNames().stream()
                .map(name -> {
                    Kindergarten kindergarten = new Kindergarten();
                    kindergarten.setKindergartenName(name);
                    return kindergarten;
                })
                .collect(Collectors.toList());
        kindergartenRepository.saveAll(kindergartens);

        // TODO #2 유치원 반 초기 데이터 삽입
        // 각 유치원에 3개의 반을 추가
        List<KindergartenClass> kindergartenClasses = kindergartens.stream()
                .flatMap(kindergarten -> getKindergartenClassNames().stream()
                        .limit(3)
                        .map(className -> {
                            KindergartenClass kindergartenClass = new KindergartenClass();
                            kindergartenClass.setKindergartenId(kindergarten.getKindergartenId());
                            kindergartenClass.setKindergartenClassName(kindergarten.getKindergartenName() + " " + className);
                            return kindergartenClass;
                        }))
                .collect(Collectors.toList());

        kindergartenClassRepository.saveAll(kindergartenClasses);

        // TODO #3 부모님 데이터 삽입

        // TODO #4 선생님 데이터 삽입

        // TODO #5 유치원생 데이터 삽입

        // TODO #6 알림장 데이터 삽입

        // TODO #7 성장일지 데이터 삽입

        // TODO #8 투약 관련 데이터 삽입

        // TODO #9 결석 관련 데이터 삽입

        // TODO #10 버스 정류장 데이터 삽입

        // TODO #11 버스 정류장에 아이 데이터 삽입

        return "데이터 세팅 성공";
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

}
