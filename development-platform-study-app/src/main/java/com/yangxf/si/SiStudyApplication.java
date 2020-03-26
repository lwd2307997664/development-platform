/**
 * FileName: SiStudyApplication
 * Author:   Administrator
 * Date:     2020/3/6 22:44
 * Description: 学习应用启动文件
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * 〈一句话功能简述〉<br>
 * 〈学习应用启动文件〉
 *
 * @author lin.wd
 * @create 2020/3/6
 * @since 1.0.0
 */
@SpringBootApplication
@ComponentScan(basePackages = "com.yangxf.si")
public class SiStudyApplication {
    public static void main(String[] args) {
        SpringApplication.run(SiStudyApplication.class, args);
    }
}
