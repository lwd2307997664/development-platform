/**
 * FileName: ProjectDemoAssembler
 * Author:   Administrator
 * Date:     2021/2/20 9:07
 * Description:
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.modules.business.controller;
import com.google.common.collect.Lists;

import com.yangxf.si.modules.business.entity.ProjectDemo;

import java.util.ArrayList;
import java.util.List;

/**
 * 〈数据转换器〉<br>
 * 〈〉
 *
 * @author Administrator
 * @create 2021/2/20
 * @since 1.0.0
 */
public class ProjectDemoAssembler {

    public static ProjectDemoDTO toDTO(ProjectDemo projectDemo){
        ProjectDemoDTO projectDemoDTO = new ProjectDemoDTO();
        projectDemoDTO.setId(projectDemo.getId());
        projectDemoDTO.setName(projectDemo.getName());
        projectDemoDTO.setIdNumber(projectDemo.getIdNumber());
        projectDemoDTO.setSex(projectDemo.getSex());
        projectDemoDTO.setBirthday(projectDemo.getBirthday());
        return projectDemoDTO;
    }

    public static List <ProjectDemoDTO> toDTOList(List<ProjectDemo> list){
        List<ProjectDemoDTO> projectDemoDTOlist=new ArrayList <>();
        for (ProjectDemo detail:list ) {
            projectDemoDTOlist.add(toDTO(detail));
        }
        return projectDemoDTOlist;


    }
}
