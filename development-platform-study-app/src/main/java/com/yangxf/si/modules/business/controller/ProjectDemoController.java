/**
 * FileName: ProjectDemoController
 * Author:   Administrator
 * Date:     2021/2/3 11:08
 * Description:
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.modules.business.controller;

import com.yangxf.si.modules.business.entity.ProjectDemo;
import com.yangxf.si.modules.business.service.ProjectDemoService;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 〈测试文件〉<br>
 * 〈第一个创建文件〉
 *
 * @author lin.wd
 * @create 2021/2/7
 * @since 1.0.0
 */
@RestController
@Log4j
public class ProjectDemoController {

    @Autowired
    private ProjectDemoService projectDemoService;

    @GetMapping("/demo")
    public String hello() {
        ProjectDemo projectDemo=new ProjectDemo();
        projectDemo.setName("linwd");
        projectDemo.setIdNumber("110101198001010037");
        projectDemo.setSex("1");
        projectDemo.setBirthday(Long.valueOf("20200101"));
        projectDemoService.saveProjectDemo(projectDemo);
        log.info("保存成功！");
        log.info("查询主数据源："+projectDemoService.queryMaster("linwd","110101198001010037").toString());
        log.info("查询第二数据源："+projectDemoService.querySecondary("linwd","110101198001010037").toString());

        return projectDemoService.queryMaster("linwd","110101198001010037").toString();
    }
}
