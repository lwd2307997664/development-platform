package com.yangxf.si.core.logs;

import com.yangxf.si.core.entity.UuidEntityBase;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


/**
 * 操作日志实体
 *
 * @author lin.wd
 */
@Entity
@Access(AccessType.FIELD)
@Table(name = "SYS_LOG_OPT")
@Data
@NoArgsConstructor
public class SysLogOpt extends UuidEntityBase <SysLogOpt, String> {

    private static final long serialVersionUID = -3659465267913789663L;
    /**
     * 日志类型
     *
     * @return
     */
    @Column(name="LOGTYPE")
    private String logType;

    /**
     * 类名
     *
     * @return
     */
    @Column(name="CLASSNAME")
    private String className;
    /**
     * 方法名
     *
     * @return
     */
    @Column(name="METHODNAME")
    private String methodName;
    /**
     * 参数
     *
     * @return
     */
    private String params;
    /**
     * 执行时间     
     *
     * @return
     */
    @Column(name="EXECTIME")
    private Long execTime;
    /**
     * 切面注释
     *
     * @return
     */
    private String remark;
    /**
     * 创建时间
     *
     * @return
     */
    @Column(name="CREATEDATE")
    private Long createDate;
    /**
     * 请求URL
     *
     * @return
     */
    private String url;
    /**
     * 请求IP
     *
     * @return
     */
    private String ip;
    /**
     * 请求方法
     *
     * @return
     */
    @Column(name="HTTPMETHOD")
    private String httpMethod;


    @Override
    public String getPK() {
        return super.getId();
    }

}
