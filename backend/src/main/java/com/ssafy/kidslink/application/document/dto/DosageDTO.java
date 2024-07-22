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
    private LocalDate dosageStartdate;
    private LocalDate dosageEnddate;
    private String dosageName;
    private String dosageVolume;
    private String dosageNum;
    private List<String> dosageTime;
    private String dosageStore;
    private String dosageDetails;
    private ConfirmationStatus confirmationStatus;
    private Integer childId;
}
