/**
 * FileName: NativeQueryResultEntity
 * Author:   Administrator
 * Date:     2021/2/20 9:58
 * Description:
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.core.jpa.nativequery;


import java.lang.annotation.*;

/**
 * 〈定义Native查询实体对象〉<br>
 *
 * @author Administrator
 * @create 2021/2/20
 * @since 1.0.0
 */
@Documented
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface NativeQueryResultEntity {
    // 标示接口
    NativeQueryMapType mapType() default NativeQueryMapType.BY_COLUMN_NAME;
}
