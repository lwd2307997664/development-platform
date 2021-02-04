package com.yangxf.si.core.utils;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * Spring上下文工具类
 *
 *
 */
@Component
public class SpringContextUtils implements ApplicationContextAware {

    /** spring 上下文 */
    private static ApplicationContext applicationContext;

    /**
     * 日志
     */
    private static final Log LOGGER = LogFactory.getLog(SpringContextUtils.class);

    /**
     * 注入ApplicationContext
     *
     * @param context
     */
    public static void setContext(ApplicationContext context) {
        SpringContextUtils.applicationContext = context;
    }

    /**
     * 实现父类的setApplicationContext方法注入ApplicationContext
     */
    @Override
    public void setApplicationContext(ApplicationContext context) {
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("SpringContextUtil注入applicaitonContext");
        }
        SpringContextUtils.setContext(context);
    }

    /**
     * 获取ApplicationContext
     *
     * @return
     */
    public static ApplicationContext getApplicationContext() {
        if (hasLoadContext()) {
            return applicationContext;
        } else {
            return null;
        }
    }

    /**
     * 获取Bean
     *
     * @param name
     * @return
     */
    @SuppressWarnings("unchecked")
    public static <T> T getBean(String name) {
        if (hasLoadContext()) {
            return (T) applicationContext.getBean(name);
        }
        return null;
    }

    /**
     * 判断是否加载ApplicationContext
     *
     * @return
     */
    private static boolean hasLoadContext() {
        if (applicationContext == null) {
            throw new IllegalStateException("SpringContextUtil初始化失败,请在applicationContext.xml中定义SpringContextUtil");
        }
        return true;
    }

    /**
     * 是否包含名称为name的bean
     *
     * @param name
     * @return
     */
    public static boolean containsBean(String name) {
        return applicationContext.containsBean(name);
    }
}
