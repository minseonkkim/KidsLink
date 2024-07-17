package com.ssafy.kidslink.child.domain;

import com.ssafy.kidslink.util.Gender;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

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
    // PK 부분은 Entity로 변경
    private int kindergartenClassId;
    private int kindergartenId;
    private int parentId;

}
