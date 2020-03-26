package com.yangxf.si.modules.simis.issue.controller;

import java.io.Serializable;

/**
 * 获取系统结算期DTO
 *
 * @author lin.wd
 */
public class SystemIssueDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1613653268202511141L;
    /**
     * 单位ID
     */
    private Long companyId;
    /**
     * 结算期
     */
    private Long issue;

    /**
     * 服务器当前时间
     */
    private Long systemTime;


    /**
     * 服务时间14位
     */
    private Long longTime;

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getIssue() {
        return issue;
    }

    public void setIssue(Long issue) {
        this.issue = issue;
    }

    public Long getSystemTime() {
        return systemTime;
    }

    public void setSystemTime(Long systemTime) {
        this.systemTime = systemTime;
    }

    public Long getLongTime() {
        return longTime;
    }

    public void setLongTime(Long longTime) {
        this.longTime = longTime;
    }

    public SystemIssueDTO() {
        super();
    }

    public SystemIssueDTO(Long companyId, Long issue, Long systemTime, Long longTime) {
        this.companyId = companyId;
        this.issue = issue;
        this.systemTime = systemTime;
        this.longTime = longTime;
    }
}
