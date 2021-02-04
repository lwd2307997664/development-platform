package com.yangxf.si.core.issue;


import com.yangxf.si.core.utils.LongDateUtils;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * 获取默认结算期
 *
 * @author lin.wd
 */
@Service
public class DefaultIssue implements Issue {
    /**
     * 获取默认结算期
     */
    public Long getIssue() {
        return LongDateUtils.toMonthLong(new Date());
    }
}
