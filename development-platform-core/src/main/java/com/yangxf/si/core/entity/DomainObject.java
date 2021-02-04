package com.yangxf.si.core.entity;

/**
 * @author linwd
 * @param <T>
 */
public interface DomainObject<T> {

    boolean isSame(T other);
}
