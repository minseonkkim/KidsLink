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
        dto.setStartDate(dosage.getDosageStartdate());
        dto.setEndDate(dosage.getDosageEnddate());
        dto.setName(dosage.getDosageName());
        dto.setVolume(dosage.getDosageVolume());
        dto.setNum(dosage.getDosageNum());
        dto.setTimes(Arrays.asList(dosage.getDosageTime().split(",")));
        dto.setStorageInfo(dosage.getDosageStore());
        dto.setDetails(dosage.getDosageDetails());
        dto.setConfirmationStatus(dosage.getConfirmationStatus());
        dto.setChildId(dosage.getChild().getChildId());
        return dto;
    }

    public Dosage toEntity(DosageDTO dto, Child child) {
        if (dto == null) {
            return null;
        }
        Dosage dosage = new Dosage();
        dosage.setDosageId(dto.getDosageId());
        dosage.setDosageStartdate(dto.getStartDate());
        dosage.setDosageEnddate(dto.getEndDate());
        dosage.setDosageName(dto.getName());
        dosage.setDosageVolume(dto.getVolume());
        dosage.setDosageNum(dto.getNum());
        dosage.setDosageTime(String.join(",", dto.getTimes()));
        dosage.setDosageStore(dto.getStorageInfo());
        dosage.setDosageDetails(dto.getDetails());
        dosage.setConfirmationStatus(dto.getConfirmationStatus());
        dosage.setChild(child);
        return dosage;
    }
}
