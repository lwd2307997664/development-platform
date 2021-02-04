package com.yangxf.si.modules.business.entity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 项目demo仓储
 * @author Administrator
 */
@Repository
public interface ProjectDemoRepository
        extends JpaRepository <ProjectDemo, String>, JpaSpecificationExecutor <ProjectDemo> {

        List <ProjectDemo> findByNameAndIdNumber(String name,String idNumber);
}
