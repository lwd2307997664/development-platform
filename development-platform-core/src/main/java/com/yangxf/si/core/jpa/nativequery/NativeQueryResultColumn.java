/**
 * FileName: NativeQueryResultColumn
 * Author:   Administrator
 * Date:     2021/2/20 9:57
 * Description:
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.core.jpa.nativequery;

import java.lang.annotation.*;

/**
 * 〈定义查询实体映射列〉<br>
 * @author Administrator
 * @create 2021/2/20
 * @since 1.0.0
 */
@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface NativeQueryResultColumn {
    /** 映射列名 */
    String value() default "";

    /** 映射顺序(从0开始) */
    int index() default 0;
}
