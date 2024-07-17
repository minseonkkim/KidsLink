package com.ssafy.kidslink.application.parent.domain;

import com.ssafy.kidslink.application.child.domain.Child;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@Entity
public class Parent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int parentId;

    String parentUsername;
    String parentName;
    String parentPwd;
    String parentNickname;
    String parentTel;
    String parentEmail;

    @OneToMany(mappedBy = "parent")
    private List<Child> children;
}
