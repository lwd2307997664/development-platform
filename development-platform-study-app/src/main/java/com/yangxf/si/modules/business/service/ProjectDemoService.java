package com.yangxf.si.modules.business.service;


import com.yangxf.si.modules.business.controller.ProjectDemoDTO;
import com.yangxf.si.modules.business.entity.ProjectDemo;

import java.util.List;

/**
 * 项目demo服务
 * @author Administrator
 */
public interface ProjectDemoService {
    /**
     * 保存
     * 
     * @param projectDemo
     */
    void saveProjectDemo(ProjectDemo projectDemo);


    /**查询主数据源*/
    List <ProjectDemoDTO> queryMaster(String name, String idNumber);


    /**查询第二数据源*/
    List <ProjectDemoDTO> querySecondary(String name,String idNumber);
}
