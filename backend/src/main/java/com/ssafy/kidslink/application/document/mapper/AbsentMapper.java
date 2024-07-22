package com.ssafy.kidslink.application.document.mapper;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.document.domain.Absent;
import com.ssafy.kidslink.application.document.dto.AbsentDTO;
import org.springframework.stereotype.Component;

@Component
public class AbsentMapper {
        public AbsentDTO toDTO(Absent absent) {
        if (absent == null) {
            return null;
        }

        AbsentDTO dto = new AbsentDTO();
        dto.setAbsentId(absent.getAbsentId());
        dto.setStartDate(absent.getAbsentStartdate());
        dto.setEndDate(absent.getAbsentEnddate());
        dto.setReason(absent.getAbsentReason());
        dto.setSpecialNotes(absent.getAbsentDetails());
        dto.setConfirmationStatus(absent.getConfirmationStatus());
        dto.setChildId(absent.getChild().getChildId());

        return dto;
    }

        public Absent toEntity(AbsentDTO dto, Child child) {
        if (dto == null) {
            return null;
        }

        Absent absent = new Absent();
        absent.setAbsentId(dto.getAbsentId());
        absent.setAbsentStartdate(dto.getStartDate());
        absent.setAbsentEnddate(dto.getEndDate());
        absent.setAbsentReason(dto.getReason());
        absent.setAbsentDetails(dto.getSpecialNotes());
        absent.setConfirmationStatus(dto.getConfirmationStatus());
        absent.setChild(child);

        return absent;
    }
}
