package com.ssafy.kidslink.application.document.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class DocumentDTO {
    private List<DosageDTO> dosages;
    private List<AbsentDTO> absents;
}
