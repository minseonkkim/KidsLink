package com.ssafy.kidslink.application.notification.respository;

import com.ssafy.kidslink.application.notification.domain.ParentNotification;
import com.ssafy.kidslink.application.parent.domain.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParentNotificationRepository extends JpaRepository<ParentNotification, Long> {
    List<ParentNotification> findByParent(Parent parent);
    @Query("SELECT COUNT(tn) FROM ParentNotification tn WHERE tn.parent = :parent")
    int countByParent(Parent parent);
}
