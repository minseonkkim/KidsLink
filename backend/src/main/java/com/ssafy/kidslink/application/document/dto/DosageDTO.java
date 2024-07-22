package com.ssafy.kidslink.application.document.dto;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.common.enums.ConfirmationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@ToString
public class DosageDTO {
    private Integer dosageId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String name;
    private String volume;
    private String num;
    private List<String> times;
    private String storageInfo;
    private String details;
    private ConfirmationStatus confirmationStatus;
    private Integer childId;
}
