package com.ssafy.kidslink.application.kindergartenclass.domain;

import com.ssafy.kidslink.application.child.domain.Child;
import com.ssafy.kidslink.application.kindergarten.domain.Kindergarten;
import com.ssafy.kidslink.application.noticeboard.domain.NoticeBoard;
import com.ssafy.kidslink.application.teacher.domain.Teacher;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "kindergarten_class")
public class KindergartenClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer kindergartenClassId;

    @ManyToOne
    @JoinColumn(name = "kindergarten_id", nullable = false)
    private Kindergarten kindergarten;

    private String kindergartenClassName;

    @OneToMany(mappedBy = "kindergartenClass")
    private List<NoticeBoard> noticeBoards;

    @OneToMany(mappedBy = "kindergartenClass")
    private List<Child> children;

    @OneToMany(mappedBy = "kindergartenClass")
    private List<Teacher> teachers;
}
