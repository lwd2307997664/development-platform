package com.yangxf.si.core.logs;

import com.yangxf.si.core.entity.UuidEntityBase;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Entity;
import javax.persistence.Table;


/**
 * 操作日志实体
 *
 * @author lin.wd
 */
@Entity
@Access(AccessType.FIELD)
@Table(name = "LOG_PRE_OPT")
public class LogPreOpt extends UuidEntityBase <LogPreOpt, String> {

    private static final long serialVersionUID = -3659465267913789663L;

    private String account;

    private String time;

    private String method;

    private String projid;

    private String err;

    private String status;//状态===默认0===重新推送成功1===

    @Override
    public String getPK() {
        return super.getId();
    }


    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getProjid() {
        return projid;
    }

    public void setProjid(String projid) {
        this.projid = projid;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getErr() {
        return err;
    }

    public void setErr(String err) {
        this.err = err;
    }
}
