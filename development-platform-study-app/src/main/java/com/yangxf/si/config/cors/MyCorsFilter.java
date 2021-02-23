///**
// * FileName: MyCorsFilter
// * Author:   Administrator
// * Date:     2021/2/22 16:54
// * Description: 过滤器完成跨域设置
// * History:
// * <author>          <time>          <version>          <desc>
// * 作者姓名           修改时间           版本号              描述
// */
//package com.yangxf.si.config.cors;
//
//import org.springframework.stereotype.Component;
//
//import javax.servlet.*;
//import javax.servlet.http.HttpServletResponse;
//import java.io.IOException;
//
///**
// * 〈SpringMVC3以及之前的版本通过如下方式完成CORS〉<br>
// * 〈过滤器完成跨域设置〉
// *
// * @author Administrator
// * @create 2021/2/22
// * @since 1.0.0
// */
//@Component
//public class MyCorsFilter implements Filter {
//
//    @Override
//    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
//        HttpServletResponse response = (HttpServletResponse) res;
//        response.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
//        response.setHeader("Access-Control-Allow-Credentials", "true");
//        response.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS, PATCH");
//        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Token,Accept, Connection, User-Agent, Cookie");
//        response.setHeader("Access-Control-Max-Age", "3600");
//
//        System.out.println("设置跨域请求");
//        chain.doFilter(req, response);
//    }
//    @Override
//
//    public void init(FilterConfig filterConfig) {
//    }
//    @Override
//
//    public void destroy() {
//    }
//}
