package com.yangxf.si.core.entity;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.context.ApplicationEvent;

/**
 * 领域事件标识接口
 *
 * <pre>
 * 领域事件没有自己的生命周期，但是每个领域事件都是唯一的，它有可能有一个很明显的主键标识，
 * 比如某一次支付事件的支付单据号，或者仅仅只能由何时、何地、发生了什么事件推导出自己的唯一标识。
 *
 * 提供了最基础的实体比较方法<code>hashCode</code>与<code>equals</code>
 * 因为Event也是不可变的对象，因此可以使用所有子类属性实现equals方法。
 *
 * 持久化id采用uuid
 * </pre>
 * @author linwd
 */
public abstract class DomainEvent<T> extends ApplicationEvent {

    /** 缓存 */
    private transient int cachedHashCode = 0;

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3375429920336943247L;

    /**
     * 与业务无关key
     */
    private String id = null;

    /**
     * 构造函数
     *
     * @param source 发出事件的源对象,不能为空(never {@code null})
     */
    public DomainEvent(Object source) {
        super(source);
    }

    /**
     * 默认无参构造函数
     */
    protected DomainEvent() {
        // for jpa
        super("");
    }

    /**
     * @param other The other value object.
     * @return True if all non-transient fields are equal.
     */
    protected boolean isSame(T other) {
        return other != null && EqualsBuilder.reflectionEquals(this, other, false);
    }

    /**
     * @return Hash code built from all non-transient fields.
     */
    @Override
    public final int hashCode() {
        // Using a local variable to ensure that we only do a single read
        // of the cachedHashCode field, to avoid race conditions.
        // It doesn't matter if several threads compute the hash code and
        // overwrite
        // each other, but it's important that we never return 0, which could
        // happen
        // with multiple reads of the cachedHashCode field.
        //
        // See java.lang.String.hashCode()
        int h = cachedHashCode;
        if (h == 0) {
            // Lazy initialization of hash code.
            // Value objects are immutable, so the hash code never changes.
            h = HashCodeBuilder.reflectionHashCode(this, false);
            cachedHashCode = h;
        }

        return h;
    }

    /**
     * @param o other object
     * @return True if other object has the same value as this object.
     */
    @SuppressWarnings("unchecked")
    @Override
    public final boolean equals(final Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        return isSame((T) o);
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
     * @param id
     *            the id to set
     */
    @SuppressWarnings("unused")
    private void setId(String id) {
        // for hibernate/sonar检查错误
        this.id = id;
    }

}
