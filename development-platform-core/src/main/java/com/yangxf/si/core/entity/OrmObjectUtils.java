package com.yangxf.si.core.entity;

import org.hibernate.proxy.HibernateProxy;

/**
 * 在hibernate环境下将被代理过的原始对象解析出来
 *
 */
public class OrmObjectUtils {

    /**
     * 隐藏工具类构造函数
     */
    private OrmObjectUtils() {
        // hide
    }

    /**
     * 返回被Hibernate代理的原始类
     *
     * @return 如果被代理过则返回原始对象，如果没有被代理过，则原样返回
     */
    public static Object unwrapHibernateProxy(final Object o) {
        if (o instanceof HibernateProxy) {
            return ((HibernateProxy) o).getHibernateLazyInitializer()
                    .getImplementation();
        } else {
            return o;
        }
    }
}
