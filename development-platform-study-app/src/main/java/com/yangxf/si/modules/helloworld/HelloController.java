/**
 * FileName: HelloController
 * Author:   Administrator
 * Date:     2020/3/7 19:26
 * Description: 第一个
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.modules.helloworld;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 〈测试文件〉<br>
 * 〈第一个创建文件〉
 *
 * @author lin.wd
 * @create 2020/3/7
 * @since 1.0.0
 */
@RestController
public class HelloController {

    @RequestMapping(value="/hello")
    public String hello() {
        return "Hello world";
    }
}
