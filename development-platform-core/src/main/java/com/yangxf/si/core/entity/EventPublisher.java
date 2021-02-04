package com.yangxf.si.core.entity;

/**
 * 事件发布者接口(标示接口)
 * @author linwd
 */
public interface EventPublisher {

    /**
     * 发布领域事件
     *
     * @param event
     */
    public void publish(DomainEvent<?> event);
}
