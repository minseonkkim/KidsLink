package com.ssafy.kidslink.application.noticeboard.domain;

import com.ssafy.kidslink.application.kindergartenclass.domain.KindergartenClass;
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
    @Column(name = "notice_board_id")
    private Integer noticeBoardId;

    @Column(name = "notice_board_title")
    private String noticeBoardTitle;

    @Column(name = "notice_board_content")
    private String noticeBoardContent;

    @Column(name = "notice_board_date")
    private LocalDate noticeBoardDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "kindergarten_class_id", referencedColumnName = "kindergarten_class_id", nullable = false),
            @JoinColumn(name = "kindergarten_id", referencedColumnName = "kindergarten_id", nullable = false)
    })
    private KindergartenClass kindergartenClass;
}
