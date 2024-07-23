package com.ssafy.kidslink.application.teacher.domain;

import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
import com.ssafy.kidslink.application.teacherschedule.domain.TeacherSchedule;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "teacher")
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "teacher_id")
    private Integer teacherId;

    @Column(name = "teacher_name")
    private String teacherName;

    @Column(name = "teacher_username")
    private String teacherUsername;

    @Column(name = "teacher_pwd")
    private String teacherPwd;

    @Column(name = "teacher_nickname")
    private String teacherNickname;

    @Column(name = "teacher_email")
    private String teacherEmail;

    @Column(name = "teacher_tel")
    private String teacherTel;

    @Column(name = "teacher_profile")
    private String teacherProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "kindergarten_class_id", referencedColumnName = "kindergarten_class_id", nullable = false),
            @JoinColumn(name = "kindergarten_id", referencedColumnName = "kindergarten_id", nullable = false)
    })
    private KindergartenClass kindergartenClass;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<TeacherSchedule> teacherSchedules;
}
