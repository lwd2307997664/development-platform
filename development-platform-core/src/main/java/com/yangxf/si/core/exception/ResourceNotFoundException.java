/**
 * FileName: ResourceNotFoundException
 * Author:   Administrator
 * Date:     2021/2/20 16:10
 * Description:
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.core.exception;

/**
 * 〈资源未找到〉<br>
 * 〈〉
 *
 * @author Administrator
 * @create 2021/2/20
 * @since 1.0.0
 */
public class ResourceNotFoundException extends RuntimeException {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7861979219071225292L;

    public ResourceNotFoundException(String msg) {
        super(msg);
    }

    protected ResourceNotFoundException(String msg, Throwable cause) {
        super(msg, cause);
    }

}
