package com.yangxf.si.modules.business.service;

import com.yangxf.si.modules.business.entity.ProjectDemo;
import com.yangxf.si.modules.business.entity.ProjectDemoRepository;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;


/**
 * 项目demo服务实现
 *
 * @author Administrator
 */
@Service
public class ProjectDemoServiceImpl implements ProjectDemoService {

    @PersistenceContext(unitName = "secondary")
    private EntityManager entityManagerSecondary;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private ProjectDemoRepository projectDemoRepository;

    @Override
    public void saveProjectDemo(final ProjectDemo projectDemo) {
        projectDemoRepository.save(projectDemo);
    }

    /**
     * 查询主数据源
     * @param name
     * @param idNumber
     * @return
     */
    @Override
    public List <ProjectDemo> queryMaster(String name, String idNumber) {
        StringBuilder sql = new StringBuilder();
        sql.append("select * from PROJECT_DEMO where name=:name and id_Number=:idNumber ");
        Query p = entityManager.createNativeQuery(sql.toString());
        p.setParameter("name", name);
        p.setParameter("idNumber", idNumber);
        p.unwrap(SQLQuery.class).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
        List <ProjectDemo> list = p.getResultList();
        return list;
    }

    /**
     * 查询第二数据源
     * @param name
     * @param idNumber
     * @return
     */
    @Override
    public List <ProjectDemo> querySecondary(String name, String idNumber) {
        StringBuilder sql = new StringBuilder();
        sql.append("select * from PROJECT_DEMO where name=:name and id_Number=:idNumber ");
        Query p = entityManagerSecondary.createNativeQuery(sql.toString());
        p.setParameter("name", name);
        p.setParameter("idNumber", idNumber);
        p.unwrap(SQLQuery.class).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
        List <ProjectDemo> list = p.getResultList();
        return list;
    }

}
