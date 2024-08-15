package com.ssafy.kidslink.application.notification.domain;

import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.common.enums.NotificationCode;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "parent_notification")
public class ParentNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "parent_notification_id")
    private Integer parentNotificationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent;

    @Column(name = "code")
    @Enumerated(EnumType.STRING)
    private NotificationCode code;

    @Column(name = "parent_notification_text")
    private String parentNotificationText;

    @Column(name = "parent_notification_date")
    private LocalDate parentNotificationDate;


}