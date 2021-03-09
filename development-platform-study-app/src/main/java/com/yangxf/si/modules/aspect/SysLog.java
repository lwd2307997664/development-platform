package com.yangxf.si.modules.aspect;

import java.lang.annotation.*;

/**
 * 记录操作日志
 *
 * @Descrption 该注解是标签型注解，被此注解标注的方法需要进行查询日志记录
 */
@Target(value = ElementType.METHOD)
@Retention(value = RetentionPolicy.RUNTIME)
@Documented
public @interface SysLog {

    /**
     * @Description 查询主体Id的参数索引位置 默认为0，表示功能id在第一个参数的位置上，-1则表示未提供，无法进行校验
     */
    int idx() default 0;

    /**
     * @Description 查询方法名称
     */
    String value() default "";

    /**
     * @Description 系统类型
     */
    String sysType() default "999";
}
