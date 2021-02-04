package com.yangxf.si.modules.simis.issue.controller;

import com.yangxf.si.core.issue.Issue;
import com.yangxf.si.core.utils.LongDateUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.Date;

/**
 * 〈获取结算期-系统时间〉
 *
 * @author lin.wd
 * @create 2020/3/26
 * @since 1.0.0
 */
@RestController
@RequestMapping(GetSystemIssueRestController.BASE_URL)
public class GetSystemIssueRestController {
    /**
     * 根路径
     */
    public final static String BASE_URL = "/simis/issue";

    @Value("${testFlag}")
    private Boolean testFlag = false;// 是否是测试环境的标识，默认false非测试环境

    /**
     * 系统结算期
     */
    @Resource
    private Issue issue;

    /**
     * 查询系统结算期
     *
     * @return
     */
    @RequestMapping(method = RequestMethod.GET)
    public SystemIssueDTO getIssue() {
        Long issueValue = issue.getIssue();
//        if (null == issueValue) {
//            throw new ResourceNotFoundException("获取系统结算期失败");
//        }
        Long systemTime = LongDateUtils.toDayLong(new Date());
        SystemIssueDTO dto = new SystemIssueDTO();
        dto.setIssue(issueValue);
        dto.setSystemTime(systemTime);
        Long longTime = LongDateUtils.toSecondLong(new Date());
        dto.setLongTime(longTime);
        return dto;
    }

    /**
     * 查询是否是测试环境的标识
     *
     * @return
     */
    @RequestMapping(value = "/testflag", method = RequestMethod.GET)
    public TestFlagDTO gettestFlog() {
        TestFlagDTO dto = new TestFlagDTO(testFlag);
        return dto;
//        TestFlagDTO dto = new TestFlagDTO(true);
//        return dto;
    }
}
