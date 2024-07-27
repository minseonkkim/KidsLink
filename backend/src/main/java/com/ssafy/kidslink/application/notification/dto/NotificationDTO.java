package com.ssafy.kidslink.application.notification.dto;

import com.ssafy.kidslink.common.enums.NotificationCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
public class NotificationDTO {
    private int id;
    private Date date;
    private String contents;
    private NotificationCode code;
}
