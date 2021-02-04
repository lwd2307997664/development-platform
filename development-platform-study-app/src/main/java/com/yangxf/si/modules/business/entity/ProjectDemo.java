package com.yangxf.si.modules.business.entity;


import com.yangxf.si.core.entity.UuidEntityBase;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * 项目demo实体
 * @author Administrator
 */
@Entity
@Access(AccessType.FIELD)
@Table(name = "PROJECT_DEMO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDemo extends UuidEntityBase <ProjectDemo, String> {

    private static final long serialVersionUID = -3659465267913789663L;

    private String name;

    @Column(name="ID_NUMBER")
    private String idNumber;

    private String sex;

    private Long birthday;

    @Override
    public String getPK() {
        return super.getId();
    }
}
