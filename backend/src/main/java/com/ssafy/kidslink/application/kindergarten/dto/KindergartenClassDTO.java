package com.ssafy.kidslink.application.kindergarten.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class KindergartenClassDTO {
    private KindergartenDTO kindergarten;
    private Integer kindergartenClassId;
    private String kindergartenClassName;
}
