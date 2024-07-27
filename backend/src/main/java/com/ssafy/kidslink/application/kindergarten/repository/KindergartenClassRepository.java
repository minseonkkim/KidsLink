package com.ssafy.kidslink.application.kindergarten.repository;

import com.ssafy.kidslink.application.kindergarten.domain.KindergartenClass;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KindergartenClassRepository extends JpaRepository<KindergartenClass, Integer> {
    KindergartenClass findByKindergartenKindergartenNameAndKindergartenClassName(String kindergartenName, String kindergartenClassName);
}
