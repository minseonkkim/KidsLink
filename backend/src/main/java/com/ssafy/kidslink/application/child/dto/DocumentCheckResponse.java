package com.ssafy.kidslink.application.child.dto;

import com.ssafy.kidslink.application.document.dto.AbsentDTO;
import com.ssafy.kidslink.application.document.dto.DosageDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DocumentCheckResponse {
    private List<AbsentDTO> absents;
    private List<DosageDTO> dosages;
    private boolean absentExists;
    private boolean dosageExists;
}
