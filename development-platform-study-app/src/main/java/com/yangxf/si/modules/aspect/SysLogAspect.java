/**
 * FileName: SysLogAspect
 * Author:   Administrator
 * Date:     2021/3/1 10:08
 * Description: 系统日志记录切面类
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.modules.aspect;

import com.alibaba.fastjson.JSON;
import com.yangxf.si.core.logs.SysLogOpt;
import com.yangxf.si.core.logs.SysLogOptService;
import com.yangxf.si.core.utils.LongDateUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


/**
 * 请求记录日志 --记录操作日志@RecordLogRecordLog
 *
 * @author linwd
 */
@Aspect
@Component
public class SysLogAspect {

    private final static Logger logger = LoggerFactory.getLogger(SysLogAspect.class);

    @Autowired
    private SysLogOptService sysLogOptService;

    /**
     * 切入点
     * 最常用的execution解释
     * 1、切自定义注解: @annotation(com.yangxf.si.modules.aspect.SysLog)
     * 2、切请求注解：@annotation(org.springframework.web.bind.annotation.RequestMapping)
     * 3、execution(* com.yangxf.si.modules.*.*(..))--切modules中所有类所有方法
     * 4、execution(* com.yangxf.si.modules.*.service.*Service.save*(String))--service包中，以Service为结尾的类，以save开头的方法，以String为参数
     * 5、execution(* com.yangxf.si.modules.*.service.*Service.save*(..))
     * 6、@Pointcut("pointCut1() && pointCut2()")
     * 可以使用 &&, ||, ! 运算符来定义切点
     */
    @Pointcut("@annotation(com.yangxf.si.modules.aspect.SysLog)")
    public void logPointCut() {
    }

    /**
     * 前置通知
     *
     * @param point
     */
    @Before("logPointCut()")
    public void doBefore(JoinPoint point) {
        logger.info("SysLogAspect----doBefore");
    }

    /**
     * 环绕通知
     *
     * @param point
     * @return
     * @throws Throwable
     */
    @Around("logPointCut()")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        logger.info("SysLogAspect----around");
        long beginTime = System.currentTimeMillis();
        Object result = point.proceed();
        long time = System.currentTimeMillis() - beginTime;
        try {
            saveLog(point, time);
        } catch (Exception e) {
            //日志保存是报错不抛出
        }
        return result;

    }

    /**
     * 保存日志
     *
     * @param joinPoint
     * @param time
     */
    private void saveLog(ProceedingJoinPoint joinPoint, long time) {
        SysLogOpt sysLogOpt = new SysLogOpt();
        sysLogOpt.setExecTime(time);//执行时间-时间戳
        /**
         * //获取请求url,ip,httpMethod        
         */
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        String ip = request.getRemoteAddr();
        String httpMethod = request.getMethod();
        String url = request.getRequestURI().toString();
        sysLogOpt.setIp(ip);//请求IP
        sysLogOpt.setUrl(url);//请求URL
        sysLogOpt.setHttpMethod(httpMethod);//请求方法
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        sysLogOpt.setCreateDate(LongDateUtils.toSecondLong(new Date()));//创建时间--20210301204812
        Method method = signature.getMethod();
        SysLog sysLogAnnotation = method.getAnnotation(SysLog.class);
        if (sysLogAnnotation != null) {
            sysLogOpt.setRemark(sysLogAnnotation.value());//标签：方法名
            sysLogOpt.setLogType(sysLogAnnotation.sysType());//日志所在系统类型--多个系统公用一个库一个表时
        }

        /**
         * 请求类名、方法名
         */
        String className = joinPoint.getTarget().getClass().getName();
        String methodName = signature.getName();
        sysLogOpt.setClassName(className);
        sysLogOpt.setMethodName(methodName);

        /**
         * 请求参数
         */
        Object[] args = joinPoint.getArgs();
        try {
            List <String> list = new ArrayList <>();
            for (Object object : args) {
                list.add(JSON.toJSON(object).toString());
            }
            sysLogOpt.setParams(list.toString());
        } catch (Exception e) {
            //
        }
        sysLogOptService.save(sysLogOpt);

    }


}

