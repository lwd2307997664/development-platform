/**
 * FileName: WebMvcConfig
 * Author:   Administrator
 * Date:     2021/2/7 20:29
 * Description: 自定义静态资源策略
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.config.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 〈一句话功能简述〉<br>
 * 〈自定义静态资源策略〉
 *
 * @author Adminstrator
 * @create 2021/2/7
 * @since 1.0.0
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

//    @Bean
//    public BusiInterceptor getBusiInterceptor(){
//        return  new BusiInterceptor();
//    }

    /**
     * 自定义资源映射
     *
     * @param registry
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
    }

//    /**
//     * 业务拦截器
//     * @param registry
//     */
//    @Override
//    public void addInterceptors(InterceptorRegistry registry) {
//        registry.addInterceptor(this.getBusiInterceptor()).addPathPatterns("/demo,/business/**");
////        registry.addInterceptor(this.getBusiInterceptor()).addPathPatterns("/**");
//
//    }
}
