package com.ssafy.kidslink.application.parent.repository;

import com.ssafy.kidslink.application.parent.domain.Parent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParentRepository extends JpaRepository<Parent, Integer> {
}
