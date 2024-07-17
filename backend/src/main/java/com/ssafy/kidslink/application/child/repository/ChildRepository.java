package com.ssafy.kidslink.application.child.repository;

import com.ssafy.kidslink.application.child.domain.Child;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChildRepository extends JpaRepository<Child, Integer> {
}
