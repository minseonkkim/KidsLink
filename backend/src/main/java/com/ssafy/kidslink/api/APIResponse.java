package com.ssafy.kidslink.api;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class APIResponse<T> {
    private String status;
    private T data;
    private String message;
    private APIError error;
}
