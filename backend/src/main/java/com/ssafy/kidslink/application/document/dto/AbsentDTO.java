package com.ssafy.kidslink.application.document.dto;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.common.enums.ConfirmationStatus;
import jakarta.persistence.*;
import jakarta.websocket.server.ServerEndpoint;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class AbsentDTO {
    private Integer absentId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private String details;
    private ConfirmationStatus confirmationStatus;
    private Integer childId;
    private String childName;
}
