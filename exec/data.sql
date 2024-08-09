-- Kindergarten 테이블에 초기 데이터 삽입
INSERT INTO kindergarten (kindergarten_name) VALUES ('떡잎 유치원');
INSERT INTO kindergarten (kindergarten_name) VALUES ('백악관 유치원');
INSERT INTO kindergarten (kindergarten_name) VALUES ('까리따스 유치원');
INSERT INTO kindergarten (kindergarten_name) VALUES ('기쁨 유치원');
INSERT INTO kindergarten (kindergarten_name) VALUES ('병설 유치원');
INSERT INTO kindergarten (kindergarten_name) VALUES ('리더스 유치원');

-- KindergartenClass 테이블에 초기 데이터 삽입
INSERT INTO kindergarten_class (kindergarten_id, kindergarten_class_name)
VALUES 
    ((SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '떡잎 유치원'), '해바라기반'),
    ((SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '떡잎 유치원'), '장미반'),
    ((SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '떡잎 유치원'), '무궁화반'),
    ((SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '백악관 유치원'), '꿈나무반'),
    ((SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '백악관 유치원'), '햇살반'),
    ((SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '까리따스 유치원'), '별빛반'),
    ((SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '까리따스 유치원'), '달빛반');

INSERT INTO bus values (1, '타요타요', 1);
INSERT INTO bus_stop values (1,'금호지구대', 1,35.112490, 126.897009);
INSERT INTO bus_stop values (2, '세정아울렛', 1,35.13531, 126.8595);
INSERT INTO bus_stop values (3, '국민은행 사거리', 1,35.1353097, 126.8594634);
INSERT INTO bus_stop values (4, '호남파이프 건너편',1,35.19111, 126.8100);


INSERT INTO bus_stop_child values (1, 1,'T');
INSERT INTO bus_stop_child values (2, 2,'T');
INSERT INTO bus_stop_child values (3, 3,'T');
INSERT INTO bus_stop_child values (4, 4,'T');
INSERT INTO bus_stop_child values (5, 1,'T');
INSERT INTO bus_stop_child values (6, 2,'T');
INSERT INTO bus_stop_child values (7, 3,'T');
INSERT INTO bus_stop_child values (8, 4,'T');
INSERT INTO bus_stop_child values (9, 1,'T');
INSERT INTO bus_stop_child values (10, 2,'T');
INSERT INTO bus_stop_child values (11, 3,'T');
INSERT INTO bus_stop_child values (12, 4,'T');
INSERT INTO bus_stop_child values (13, 1,'T');
INSERT INTO bus_stop_child values (14, 2,'T');
INSERT INTO bus_stop_child values (15, 3,'T');
INSERT INTO bus_stop_child values (16, 4,'T');