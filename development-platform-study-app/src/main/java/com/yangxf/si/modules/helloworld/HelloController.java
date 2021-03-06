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

import com.yangxf.si.modules.aspect.SysLog;
import lombok.extern.log4j.Log4j;
import org.springframework.web.bind.annotation.GetMapping;
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
@Log4j
public class HelloController {


    @SysLog(value="日志记录测试")
    @GetMapping("/hello")
    public String hello() {
        log.info("Hello world");
        return "Hello world";
    }
}
