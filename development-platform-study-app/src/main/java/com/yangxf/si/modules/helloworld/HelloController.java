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

import com.yangxf.si.modules.business.service.ProjectDemoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
public class HelloController {

    protected static Logger LOGGER = LoggerFactory.getLogger(HelloController.class);

    @Autowired
    private ProjectDemoService projectDemoService;

    @GetMapping("/hello")
    public String hello() {
        return "Hello world";
    }
}
