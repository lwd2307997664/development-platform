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

import com.alibaba.fastjson.JSON;
import com.yangxf.si.core.exception.ResourceNotFoundException;
import com.yangxf.si.modules.business.entity.ProjectDemo;
import com.yangxf.si.modules.business.service.ProjectDemoService;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
        List <ProjectDemoDTO> list1=projectDemoService.queryMaster("linwd","110101198001010037");
        List <ProjectDemoDTO> list2=projectDemoService.querySecondary("linwd","110101198001010037");
        String param1 = JSON.toJSONString(list1);
        String param2 = JSON.toJSONString(list1);
        log.info("查询主数据源："+param1);
        log.info("查询第二数据源："+param2);

        return param1;
    }

    @GetMapping("/exception")
    public void exception() {
       throw new ResourceNotFoundException("抛出异常");
    }
}
