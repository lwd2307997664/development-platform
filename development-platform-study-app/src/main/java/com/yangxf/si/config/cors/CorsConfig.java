///**
// * FileName: CorsConfig
// * Author:   Administrator
// * Date:     2021/2/23 9:07
// * Description: 重写 WebMvcConfigurer(全局跨域)
// * History:
// * <author>          <time>          <version>          <desc>
// * 作者姓名           修改时间           版本号              描述
// */
//package com.yangxf.si.config.cors;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
///**
// * 〈一句话功能简述〉<br>
// * 〈重写 WebMvcConfigurer(全局跨域)〉
// *
// * @author Administrator
// * @create 2021/2/23
// * @since 1.0.0
// */
//@Configuration
//public class CorsConfig implements WebMvcConfigurer {
//    /**
//     * 但是使用此方法配置之后再使用自定义拦截器时跨域相关配置就会失效。
//     *
//     * 原因是请求经过的先后顺序问题，当请求到来时会先进入拦截器中，而不是进入 Mapping 映射中，所以返回的头信息中并没有配置的跨域信息。浏览器就会报跨域异常。
//     * 不建议用
//     * @param registry
//     */
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/hello")
//                //是否发送Cookie
//                .allowCredentials(true)
//                .allowedOrigins("http://localhost:8081")
//                .allowedMethods(new String[]{"GET", "POST", "PUT", "DELETE"})
//                .allowedHeaders("*")
//                .maxAge(3600);
//    }
//}
