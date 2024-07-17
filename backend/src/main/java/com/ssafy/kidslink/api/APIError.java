package com.ssafy.kidslink.api;

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
