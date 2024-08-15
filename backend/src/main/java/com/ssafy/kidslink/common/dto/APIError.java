package com.ssafy.kidslink.common.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class APIError {
    private String code;
    private String details;
}
