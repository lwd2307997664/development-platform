package com.yangxf.si.core.logs;

import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


/**
 * 项目demo服务实现
 *
 * @author Administrator
 */
@Service
@Log4j
public class SysLogOptServiceImpl implements SysLogOptService {


    @Autowired
    private SysLogOptRepository sysLogOptRepository;


    @Override
    public void save(SysLogOpt sysLogOpt) {
        sysLogOptRepository.save(sysLogOpt);
        log.info("系统日志保存成功!");
    }
}
