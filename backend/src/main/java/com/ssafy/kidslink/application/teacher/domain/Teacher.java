package com.ssafy.kidslink.application.teacher.domain;

import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
import com.ssafy.kidslink.application.teacherschedule.domain.TeacherSchedule;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer teacherId;

    private String teacherName;
    private String teacherUsername;
    private String teacherPwd;
    private String teacherNickname;
    private String teacherEmail;
    private String teacherTel;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "kindergarten_class_id", referencedColumnName = "kindergartenClassId"),
            @JoinColumn(name = "kindergarten_id", referencedColumnName = "kindergartenId")
    })
    private KindergartenClass kindergartenClass;

    @OneToMany(mappedBy = "teacher")
    private List<TeacherSchedule> teacherSchedules;

    // Getters and Setters
}
