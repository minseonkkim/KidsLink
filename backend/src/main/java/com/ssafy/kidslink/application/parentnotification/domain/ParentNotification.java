package com.ssafy.kidslink.application.parentnotification.domain;

import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.common.enums.ConfirmationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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

    @Column(name = "confirmation_status")
    @Enumerated(EnumType.STRING)
    private ConfirmationStatus confirmationStatus;

    public enum NotificationCode {
        dosage, absent, meeting
    }
}