package com.ssafy.kidslink.application.kindergarten.repository;

import com.ssafy.kidslink.application.kindergarten.domain.Kindergarten;
import com.ssafy.kidslink.application.kindergarten.domain.KindergartenClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KindergartenClassRepository extends JpaRepository<KindergartenClass, Integer> {
    KindergartenClass findByKindergartenKindergartenNameAndKindergartenClassName(String kindergartenName, String kindergartenClassName);
    List<KindergartenClass> findByKindergarten(Kindergarten kindergarten);
}
