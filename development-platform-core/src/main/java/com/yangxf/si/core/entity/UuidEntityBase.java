package com.yangxf.si.core.entity;

import com.yangxf.si.core.utils.SpringContextUtils;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import java.io.Serializable;

/**
 * 支持UUID持久化的实体基类
 * @author linwd
 */
@MappedSuperclass
public abstract class UuidEntityBase<T extends Entity<?, ?>, P> implements Entity<T, P>, Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5833843044475106443L;

    // 与业务无关key
    private String id = null;

    /**
     * 比较两个实体是否相同，根据业务Key进行比较
     */
    @Override
    public final boolean isSame(final T other) {
        return other != null && this.getPK().equals(other.getPK());
    }

    /**
     * 实体使用主键进行比较
     */

    @Override
    public int hashCode() {
        if (getPK() != null) {
            return getPK().hashCode();
        } else {
            final int prime = 31;
            int result = 1;
            result = prime * result + ((id == null) ? 0 : id.hashCode());
            return result;
        }
    }

    @Override
    public boolean equals(final Object other) {
        if (other == null) {
            return false;
        }
        if (this == other) {
            return true;
        }
        if (OrmObjectUtils.unwrapHibernateProxy(this).getClass() != OrmObjectUtils.unwrapHibernateProxy(other)
                .getClass()) {
            return false;
        }
        @SuppressWarnings("unchecked")
        T that = (T) other;
        return this.isSame(that);
    }

    /**
     * 获取业务无关Key
     *
     * @return
     */
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    public String getId() {
        return id;
    }

    /**
     * 发布领域事件
     *
     * @param event
     */
    protected void raiseEvent(DomainEvent<?> event) {
        // 从容器当中获取EventPublisher对象
        EventPublisher publisher = (DefaultEventPublisher) SpringContextUtils.getBean(Constants.EVENT_PUBLISHER_BEAN);
        // 发布事件通知
        publisher.publish(event);
    }

    /**
     * 设置id
     *
     * @param id
     */
    @SuppressWarnings("unused")
    private void setId(String id) {
        // for hibernate
        this.id = id;
    }

}
