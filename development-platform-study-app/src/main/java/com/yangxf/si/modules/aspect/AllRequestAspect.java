/**
 * FileName: AllRequestAspect
 * Author:   Administrator
 * Date:     2021/3/1 21:27
 * Description: 统一平行权限设定切面类
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.modules.aspect;

import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

/**
 * 〈一句话功能简述〉<br>
 * 〈统一平行权限设定切面类〉
 *
 * @author Administrator
 * @create 2021/3/1
 * @since 1.0.0
 */
@Component
@Aspect
public class AllRequestAspect {

    /*** 日志 */
    private final static Logger logger = LoggerFactory.getLogger(AllRequestAspect.class);
    private static final String NOT_ALLOWED_MSG = "统一平行权限校验,不允许访问";

    /*** 处理状态 */
    enum AllowedStatusEnum {
        ALLOWED, NOT_ALLOWED
    }

    // 切全部请求
    @Pointcut("@annotation(org.springframework.web.bind.annotation.RequestMapping)")
    public void requestPointcut() {
    }

    private String getKey(String parameterName) {
        if ("personId".equalsIgnoreCase(parameterName)) {
            logger.debug("统一平行权限处理，校验根据参数 {}", parameterName);
            return "id";
        }
        if ("idNumber".equalsIgnoreCase(parameterName)) {
            logger.debug("统一平行权限处理，校验根据参数 {}", parameterName);
            return "idNumber";
        }
        return "";
    }

    @Before("requestPointcut()")
    public void doBefore(JoinPoint joinPoint) {
        if (logger.isDebugEnabled()) {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
                    .getRequest();
            logger.debug(">>>请求路径 {} 处理类 {} 处理方法 {}", request.getRequestURI(), joinPoint.getTarget().getClass().getName(), joinPoint.getSignature().getName());
        }
        AllowedStatusEnum allowedStatus = AllowedStatusEnum.NOT_ALLOWED;
        //请求参数值
        Object[] args = joinPoint.getArgs();
        //请求参数名称
        Signature signature = joinPoint.getSignature();
        MethodSignature methodSignature = (MethodSignature) signature;
        String[] parameterNames = methodSignature.getParameterNames();
        for (int i = 0; i < args.length; i++) {
            Object arg = args[i];
            if (arg == null) {
                continue;
            }
            if (isJavaClass(arg.getClass())) {
                String parameterName = parameterNames[i];
                String key = getKey(parameterName);
                if (StringUtils.isNotEmpty(key)) {
                    allowedStatus = allowedForKey(key, args[i]);
                }
            } else {
                String[] filedName = getFiledName(arg);
                for (String filed : filedName) {
                    String key = getKey(filed);
                    if (StringUtils.isNotEmpty(key)) {
                        allowedStatus = allowedForKey(key, getFieldValueByName(filed, arg));
                    }
                }
            }
        }

        if (allowedStatus == AllowedStatusEnum.NOT_ALLOWED) {
            logger.warn("统一平行权限处理，未涉及到该请求，请处理平行权限!!!");
        } else if (allowedStatus == AllowedStatusEnum.ALLOWED) {
            logger.debug("统一平行权限处理，校验通过");
        } else if (allowedStatus == AllowedStatusEnum.NOT_ALLOWED) {
            logger.error(NOT_ALLOWED_MSG);
        }
    }


    public AllowedStatusEnum allowedForKey(String key, Object value) {
        //value为空,无法校验
        if (value == null) {
            return AllowedStatusEnum.ALLOWED;
        }

        /**
         * 结合认证项目的SpringSecurity实现权限管理
         * 获取缓存中登录成功后，缓存的用户信息，对比，如果不是当前登录用户，不允许请求
         */

        return AllowedStatusEnum.ALLOWED;
    }

    /**
     * 判断一个类是JAVA类型还是用户定义类型
     *
     * @param clz
     * @return
     */
    public static boolean isJavaClass(Class <?> clz) {
        return clz != null && clz.getClassLoader() == null;
    }

    /**
     * 获取属性名数组
     */
    private String[] getFiledName(Object o) {
        Field[] fields = o.getClass().getDeclaredFields();
        String[] fieldNames = new String[fields.length];
        for (int i = 0; i < fields.length; i++) {
            fieldNames[i] = fields[i].getName();
        }
        return fieldNames;
    }


    /**
     * 根据属性名获取属性值
     */
    private Object getFieldValueByName(String fieldName, Object o) {
        try {
            String firstLetter = fieldName.substring(0, 1).toUpperCase();
            String getter = "get" + firstLetter + fieldName.substring(1);
            Method method = o.getClass().getMethod(getter, new Class[]{});
            Object value = method.invoke(o, new Object[]{});
            return value;
        } catch (Exception e) {
            return null;
        }
    }

}

