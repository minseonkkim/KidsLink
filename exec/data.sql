-- Kindergarten 테이블에 초기 데이터 삽입
INSERT INTO kindergarten (kindergarten_name) VALUES ('사랑 유치원');
INSERT INTO kindergarten (kindergarten_name) VALUES ('희망 유치원');
INSERT INTO kindergarten (kindergarten_name) VALUES ('기쁨 유치원');

-- KindergartenClass 테이블에 초기 데이터 삽입
INSERT INTO kindergarten_class (kindergarten_id, kindergarten_class_name)
VALUES 
    ((SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '사랑 유치원'), '사랑반'),
    ((SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '사랑 유치원'), '기쁨반'),
    ((SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '희망 유치원'), '꿈나무반'),
    ((SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '희망 유치원'), '햇살반'),
    ((SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '기쁨 유치원'), '별빛반'),
    ((SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '기쁨 유치원'), '달빛반');
    
-- Teacher 테이블에 초기 데이터 삽입
INSERT INTO teacher (teacher_name, teacher_username, teacher_pwd, teacher_nickname, teacher_email, teacher_tel, kindergarten_class_id, kindergarten_id)
VALUES 
    ('김선생', 'kimteacher', 'password123', '김쌤', 'kimteacher@example.com', '010-1234-5678', 
        (SELECT kindergarten_class_id FROM kindergarten_class WHERE kindergarten_class_name = '사랑반' AND kindergarten_id = (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '사랑 유치원')), 
        (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '사랑 유치원')),
    ('이선생', 'leeteacher', 'password456', '이쌤', 'leeteacher@example.com', '010-2345-6789', 
        (SELECT kindergarten_class_id FROM kindergarten_class WHERE kindergarten_class_name = '기쁨반' AND kindergarten_id = (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '사랑 유치원')), 
        (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '사랑 유치원')),
    ('박선생', 'parkteacher', 'password789', '박쌤', 'parkteacher@example.com', '010-3456-7890', 
        (SELECT kindergarten_class_id FROM kindergarten_class WHERE kindergarten_class_name = '꿈나무반' AND kindergarten_id = (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '희망 유치원')), 
        (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '희망 유치원')),
    ('최선생', 'choiteacher', 'password012', '최쌤', 'choiteacher@example.com', '010-4567-8901', 
        (SELECT kindergarten_class_id FROM kindergarten_class WHERE kindergarten_class_name = '햇살반' AND kindergarten_id = (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '희망 유치원')), 
        (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '희망 유치원')),
    ('강선생', 'kangteacher', 'password345', '강쌤', 'kangteacher@example.com', '010-5678-9012', 
        (SELECT kindergarten_class_id FROM kindergarten_class WHERE kindergarten_class_name = '별빛반' AND kindergarten_id = (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '기쁨 유치원')), 
        (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '기쁨 유치원')),
    ('윤선생', 'yoonteacher', 'password678', '윤쌤', 'yoonteacher@example.com', '010-6789-0123', 
        (SELECT kindergarten_class_id FROM kindergarten_class WHERE kindergarten_class_name = '달빛반' AND kindergarten_id = (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '기쁨 유치원')), 
        (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '기쁨 유치원'));

-- Parent 테이블에 초기 데이터 삽입
INSERT INTO parent (parent_username, parent_name, parent_pwd, parent_nickname, parent_tel, parent_email)
VALUES 
    ('parkparent', '박부모', 'pwparent123', '박맘', '010-1111-2222', 'parkparent@example.com'),
    ('kimparent', '김부모', 'pwparent456', '김맘', '010-3333-4444', 'kimparent@example.com'),
    ('leeparent', '이부모', 'pwparent789', '이맘', '010-5555-6666', 'leeparent@example.com'),
    ('choiparent', '최부모', 'pwparent012', '최맘', '010-7777-8888', 'choiparent@example.com'),
    ('kangparent', '강부모', 'pwparent345', '강맘', '010-9999-0000', 'kangparent@example.com'),
    ('yoonparent', '윤부모', 'pwparent678', '윤맘', '010-1212-3434', 'yoonparent@example.com');

-- Child 테이블에 초기 데이터 삽입
INSERT INTO child (child_name, child_gender, child_birth, kindergarten_class_id, kindergarten_id, parent_id)
VALUES 
    ('박아이', 'M', '2018-05-20', 
        (SELECT kindergarten_class_id FROM kindergarten_class WHERE kindergarten_class_name = '사랑반' AND kindergarten_id = (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '사랑 유치원')), 
        (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '사랑 유치원'), 
        (SELECT parent_id FROM parent WHERE parent_username = 'parkparent')),
    ('김아이', 'F', '2019-06-15', 
        (SELECT kindergarten_class_id FROM kindergarten_class WHERE kindergarten_class_name = '기쁨반' AND kindergarten_id = (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '사랑 유치원')), 
        (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '사랑 유치원'), 
        (SELECT parent_id FROM parent WHERE parent_username = 'kimparent')),
    ('이아이', 'M', '2017-04-10', 
        (SELECT kindergarten_class_id FROM kindergarten_class WHERE kindergarten_class_name = '꿈나무반' AND kindergarten_id = (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '희망 유치원')), 
        (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '희망 유치원'), 
        (SELECT parent_id FROM parent WHERE parent_username = 'leeparent')),
    ('최아이', 'F', '2020-07-25', 
        (SELECT kindergarten_class_id FROM kindergarten_class WHERE kindergarten_class_name = '햇살반' AND kindergarten_id = (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '희망 유치원')), 
        (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '희망 유치원'), 
        (SELECT parent_id FROM parent WHERE parent_username = 'choiparent')),
    ('강아이', 'M', '2018-08-30', 
        (SELECT kindergarten_class_id FROM kindergarten_class WHERE kindergarten_class_name = '별빛반' AND kindergarten_id = (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '기쁨 유치원')), 
        (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '기쁨 유치원'), 
        (SELECT parent_id FROM parent WHERE parent_username = 'kangparent')),
    ('윤아이', 'F', '2019-09-05', 
        (SELECT kindergarten_class_id FROM kindergarten_class WHERE kindergarten_class_name = '달빛반' AND kindergarten_id = (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '기쁨 유치원')), 
        (SELECT kindergarten_id FROM kindergarten WHERE kindergarten_name = '기쁨 유치원'), 
        (SELECT parent_id FROM parent WHERE parent_username = 'yoonparent'));