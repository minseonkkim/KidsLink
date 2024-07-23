package com.ssafy.kidslink.application.parent.domain;

import com.ssafy.kidslink.application.child.domain.Child;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@ToString
@Entity
@Table(name = "parent")
public class Parent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "parent_id")
    int parentId;

    @Column(name = "parent_username")
    private String parentUsername;

    @Column(name = "parent_name")
    private String parentName;

    @Column(name = "parent_pwd")
    private String parentPwd;

    @Column(name = "parent_nickname")
    private String parentNickname;

    @Column(name = "parent_tel")
    private String parentTel;

    @Column(name = "parent_email")
    private String parentEmail;

    @Column(name = "parent_profile")
    private String parentProfile;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Child> children;

}
