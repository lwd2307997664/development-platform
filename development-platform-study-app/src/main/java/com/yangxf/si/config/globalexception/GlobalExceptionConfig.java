/**
 * FileName: GlobalExceptionConfig
 * Author:   Administrator
 * Date:     2021/2/20 14:29
 * Description:
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.config.globalexception;

import com.alibaba.fastjson.JSON;
import com.yangxf.si.core.exception.ResourceNotFoundException;
import com.yangxf.si.core.global.GlobalResult;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * 〈@RestControllerAdvice〉<br>
 * 〈〉
 *
 * @author Administrator
 * @create 2021/2/20
 * @since 1.0.0
 */
@RestControllerAdvice
public class GlobalExceptionConfig {

//    /**
//     * 上传超过最大限制时抛出异常处理
//     *
//     * @param e
//     * @param response
//     */
//    @ExceptionHandler(MaxUploadSizeExceededException.class)
//    public void uploadException(MaxUploadSizeExceededException e, HttpServletResponse response) throws IOException {
//        response.setContentType("text/html;charset=utf-8");
//        PrintWriter out = response.getWriter();
//        out.write("上传文件超过最大限制!");
//        out.flush();
//        out.close();
//    }
//
//
//    @ExceptionHandler(Exception.class)
//    public void exception(Exception e, HttpServletResponse response) throws IOException {
//        /**
//         * 如果是对接不同的微服务平台，可以根据对接需要设置返回不通的异常格式
//         */
//        response.setContentType("application/json;charset=utf-8");
//        PrintWriter out = response.getWriter();
//        GlobalResult globalException = new GlobalResult();
//        globalException.setCode(500);
//        globalException.setSuccess(false);
//        globalException.setMessage("服务器异常!");
//        out.write(JSON.toJSONString(globalException));
//        out.flush();
//        out.close();
//    }
//

//    /**
//     * 上传超过最大限制时抛出异常处理
//     *
//     * @param e
//     */
//    @ExceptionHandler(MaxUploadSizeExceededException.class)
//    public ModelAndView uploadExceptionAnothrer(MaxUploadSizeExceededException e) throws IOException {
//        ModelAndView mv=new ModelAndView();
//        mv.addObject("message","上传文件超过最大限制");
//        mv.setViewName("error");
//        return mv;
//    }
}
