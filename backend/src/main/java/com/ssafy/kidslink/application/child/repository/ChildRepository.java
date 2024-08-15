package com.ssafy.kidslink.application.child.repository;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.kindergarten.domain.KindergartenClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChildRepository extends JpaRepository<Child, Integer> {
    Optional<Child> findByChildName(String username);
    List<Child> findByKindergartenClassKindergartenClassIdAndKindergartenClassKindergartenId(
            Integer kindergartenClassId, Integer kindergartenId);

    List<Child> findByKindergartenClass(KindergartenClass kindergartenClass);
}
