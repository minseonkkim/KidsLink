package com.ssafy.kidslink.application.kindergartenclass.repository;

import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KindergartenClassRepository extends JpaRepository<KindergartenClass, Integer> {
    KindergartenClass findByKindergartenKindergartenNameAndKindergartenClassName(String kindergartenName, String kindergartenClassName);
}
