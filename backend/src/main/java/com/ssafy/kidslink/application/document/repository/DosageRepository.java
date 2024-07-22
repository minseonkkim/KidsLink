package com.ssafy.kidslink.application.document.repository;


import com.ssafy.kidslink.application.document.domain.Dosage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DosageRepository extends JpaRepository<Dosage,Integer> {
}
