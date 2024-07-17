package com.ssafy.kidslink.kindergartenclass.domain;

import com.ssafy.kidslink.kindergarten.domain.Kindergarten;
import com.ssafy.kidslink.noticeboard.domain.NoticeBoard;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "kindergarten_class")
public class KindergartenClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int kindergartenClassId;
    private String kindergartenClassName;

    @ManyToOne
    @JoinColumn(name = "kindergarten_id", nullable = false)
    private Kindergarten kindergarten;


    @OneToMany(mappedBy = "kindergartenClass")
    private Set<NoticeBoard> noticeBoards;
}
