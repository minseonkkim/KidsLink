package com.ssafy.kidslink.kindergarten.domain;

import com.ssafy.kidslink.kindergartenclass.domain.KindergartenClass;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "kindergarten")
public class Kindergarten {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int kindergartenId;

    private String kindergartenName;

    @OneToMany(mappedBy = "kindergarten")
    private Set<KindergartenClass> classes;

}
