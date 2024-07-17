package com.ssafy.kidslink.noticeboard.domain;

import com.ssafy.kidslink.kindergartenclass.domain.KindergartenClass;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@ToString
@Table(name = "notice_board")
public class NoticeBoard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int noticeBoardId;
    private String noticeBoardTitle;
    private String noticeBoardContent;
    private LocalDate noticeBoardDate;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "kindergarten_class_id", referencedColumnName = "kindergarten_class_id", nullable = false),
            @JoinColumn(name = "kindergarten_id", referencedColumnName = "kindergarten_id", nullable = false)
    })
    private KindergartenClass kindergartenClass;
}
