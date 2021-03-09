package com.yangxf.si.core.logs;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * 操作日志仓储接口
 *
 * @author lin.wd
 */
@Repository
public interface SysLogOptRepository
        extends JpaRepository<SysLogOpt, String>, JpaSpecificationExecutor<SysLogOpt> {

}
