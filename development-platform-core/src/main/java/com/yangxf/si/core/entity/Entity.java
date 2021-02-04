package com.yangxf.si.core.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * @author linwd
 * @param <T>
 * @param <P>
 */
public interface Entity<T, P> extends DomainObject <T> {
    /**
     * 实体对象有业务主键
     *
     * @return 返回实体对象的唯一标识（业务主键）
     */
    @JsonIgnoreProperties
    P getPK();

}
