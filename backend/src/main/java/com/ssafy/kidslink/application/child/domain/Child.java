package com.ssafy.kidslink.application.child.domain;

import com.ssafy.kidslink.application.absent.domain.Absent;
import com.ssafy.kidslink.application.album.domain.Album;
import com.ssafy.kidslink.application.diary.domain.Diary;
import com.ssafy.kidslink.application.dosage.domain.Dosage;
import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.common.enums.Gender;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Table(name = "child")
public class Child {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "child_id")
    private Integer childId;

    @Column(name = "child_name")
    private String childName;

    @Column(name = "child_gender")
    @Enumerated(EnumType.STRING)
    private Gender childGender;

    @Column(name = "child_birth")
    private String childBirth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "kindergarten_class_id", referencedColumnName = "kindergarten_class_id", nullable = false),
            @JoinColumn(name = "kindergarten_id", referencedColumnName = "kindergarten_id", nullable = false)
    })
    private KindergartenClass kindergartenClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent;
}
