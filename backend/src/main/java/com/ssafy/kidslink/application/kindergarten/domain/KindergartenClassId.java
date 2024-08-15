package com.ssafy.kidslink.application.kindergarten.domain;

import java.io.Serializable;
import java.util.Objects;

public class KindergartenClassId implements Serializable {

    private Integer kindergartenClassId;
    private Integer kindergartenId;

    public KindergartenClassId() {}

    public KindergartenClassId(Integer kindergartenClassId, Integer kindergartenId) {
        this.kindergartenClassId = kindergartenClassId;
        this.kindergartenId = kindergartenId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        KindergartenClassId that = (KindergartenClassId) o;
        return Objects.equals(kindergartenClassId, that.kindergartenClassId) &&
               Objects.equals(kindergartenId, that.kindergartenId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(kindergartenClassId, kindergartenId);
    }
}