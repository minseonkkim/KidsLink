package com.ssafy.kidslink.application.document.mapper;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.document.domain.Absent;
import com.ssafy.kidslink.application.document.domain.Dosage;
import com.ssafy.kidslink.application.document.dto.DosageDTO;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DosageMapper {
    public DosageDTO toDTO(Dosage dosage) {
        if (dosage == null) {
            return null;
        }

        DosageDTO dto = new DosageDTO();
        dto.setDosageId(dosage.getDosageId());
        dto.setDosageStartdate(dosage.getDosageStartdate());
        dto.setDosageEnddate(dosage.getDosageEnddate());
        dto.setDosageName(dosage.getDosageName());
        dto.setDosageVolume(dosage.getDosageVolume());
        dto.setDosageNum(dosage.getDosageNum());
        dto.setDosageTime(Arrays.asList(dosage.getDosageTime().split(",")));
        dto.setDosageStore(dosage.getDosageStore());
        dto.setDosageDetails(dosage.getDosageDetails());
        dto.setConfirmationStatus(dosage.getConfirmationStatus());
        dto.setChildId(dosage.getDosageId());
        return dto;
    }

    public Dosage toEntity(DosageDTO dto, Child child) {
        if (dto == null) {
            return null;
        }
        Dosage dosage = new Dosage();
        dosage.setDosageId(dto.getDosageId());
        dosage.setDosageStartdate(dto.getDosageStartdate());
        dosage.setDosageEnddate(dto.getDosageEnddate());
        dosage.setDosageName(dto.getDosageName());
        dosage.setDosageVolume(dto.getDosageVolume());
        dosage.setDosageNum(dto.getDosageNum());
        dosage.setDosageTime(String.join(",", dto.getDosageTime()));
        dosage.setDosageStore(dto.getDosageStore());
        dosage.setDosageDetails(dto.getDosageDetails());
        dosage.setConfirmationStatus(dto.getConfirmationStatus());
        dosage.setChild(child);
        return dosage;
    }
}
