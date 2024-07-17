package com.ssafy.kidslink.application.parentnotification.domain;

import com.ssafy.kidslink.application.parent.domain.Parent;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ParentNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer parentNotificationId;

    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent;

    private String code;
    private String parentNotificationText;
    private String confirmationStatus;

    // Getters and Setters
}