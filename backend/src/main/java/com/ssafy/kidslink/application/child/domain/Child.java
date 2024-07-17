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
public class Child {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int childId;

    private String childName;
    @Enumerated(EnumType.STRING)
    private Gender childGender;
    private String childBirth;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "kindergarten_class_id", referencedColumnName = "kindergartenClassId"),
            @JoinColumn(name = "kindergarten_id", referencedColumnName = "kindergartenId")
    })
    private KindergartenClass kindergartenClass;

    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent;

    @OneToMany(mappedBy = "child")
    private List<Album> albums;

    @OneToMany(mappedBy = "child")
    private List<Diary> diaries;

    @OneToMany(mappedBy = "child")
    private List<Absent> absents;

    @OneToMany(mappedBy = "child")
    private List<Dosage> dosages;
}
