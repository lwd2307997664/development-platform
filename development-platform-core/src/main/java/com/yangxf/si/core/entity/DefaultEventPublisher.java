package com.yangxf.si.core.entity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;
import org.springframework.stereotype.Component;


/**
 * 默认领域事件发布实现
 *
 * <pre>
 * 主要利用spring的事件处理机制来实现事件传播
 * </pre>
 * @author linwd
 */
@Component(value = Constants.EVENT_PUBLISHER_BEAN)
public class DefaultEventPublisher implements ApplicationEventPublisherAware, EventPublisher {

    /** 事件发布对象 */
    private ApplicationEventPublisher publisher;

    /** 日志对象 */
    private static final Logger LOGGER = LoggerFactory.getLogger(DefaultEventPublisher.class);

    /**
     * 发布领域事件
     */
    @Override
    public void publish(DomainEvent <?> event) {
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("当前发布事件:{}", event);
        }
        publisher.publishEvent(event);
    }

    @Override
    public void setApplicationEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        publisher = applicationEventPublisher;
    }
}
