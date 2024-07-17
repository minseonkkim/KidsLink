package com.ssafy.kidslink.parent.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

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
}
