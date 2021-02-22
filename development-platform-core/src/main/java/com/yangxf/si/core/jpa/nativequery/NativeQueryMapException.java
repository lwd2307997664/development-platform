/**
 * FileName: NativeQueryMapException
 * Author:   Administrator
 * Date:     2021/2/20 10:01
 * Description:
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.core.jpa.nativequery;

/**
 * 〈映射异常〉<br>
 * 〈〉
 *
 * @author Administrator
 * @create 2021/2/20
 * @since 1.0.0
 */
public class NativeQueryMapException extends RuntimeException {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1336200127024129847L;

    protected NativeQueryMapException() {
    }

    protected NativeQueryMapException(String message, Throwable cause, boolean enableSuppression,
                                      boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    protected NativeQueryMapException(String message, Throwable cause) {
        super(message, cause);
    }

    protected NativeQueryMapException(String message) {
        super(message);
    }

    protected NativeQueryMapException(Throwable cause) {
        super(cause);
    }

}
