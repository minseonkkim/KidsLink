package com.ssafy.kidslink.application.document.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;



@Getter
@Setter
@ToString
public class DocumentDTO {
    private LocalDate date;
    private String type;
    private DosageDTO dosage;
    private AbsentDTO absent;
}
