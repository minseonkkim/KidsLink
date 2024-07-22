package com.ssafy.kidslink.application.child.domain;

import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
import com.ssafy.kidslink.application.parent.domain.Parent;
import com.ssafy.kidslink.common.enums.Gender;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
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

    @Column(name = "child_image")
    private String childImage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "kindergarten_class_id", referencedColumnName = "kindergarten_class_id", nullable = false),
            @JoinColumn(name = "kindergarten_id", referencedColumnName = "kindergarten_id", nullable = false)
    })
    private KindergartenClass kindergartenClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent;

    @Override
    public String toString() {
        return "Child{" +
                "childId=" + childId +
                ", childName='" + childName + '\'' +
                ", childGender=" + childGender +
                ", childBirth='" + childBirth + '\'' +
                ", kindergartenName=" + kindergartenClass.getKindergarten().getKindergartenName() +
                ", kindergartenClassName=" + kindergartenClass.getKindergartenClassName() +
                ", kindergartenClassName=" + parent.getParentName() +
                '}';
    }
}
