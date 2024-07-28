package com.ssafy.kidslink.application.parent.repository;

import com.ssafy.kidslink.application.parent.domain.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ParentRepository extends JpaRepository<Parent, Integer> {
    boolean existsByParentUsername(String parentUsername);
    Parent findByParentUsername(String parentUsername);
    @Query("SELECT DISTINCT c.parent FROM Child c WHERE c.kindergartenClass.kindergartenClassId = :classId")
    List<Parent> findByKindergartenClassId(int classId);
}
