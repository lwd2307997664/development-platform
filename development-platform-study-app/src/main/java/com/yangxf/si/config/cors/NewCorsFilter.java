/**
 * FileName: NewCorsFilter
 * Author:   Administrator
 * Date:     2021/2/23 10:56
 * Description: 返回新的 CorsFilter
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.config.cors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * 〈一句话功能简述〉<br>
 * 〈返回新的 CorsFilter1〉
 *
 * @author Administrator
 * @create 2021/2/23
 * @since 1.0.0
 */
@Configuration
public class NewCorsFilter {
    @Bean
    public CorsFilter corsFilter() {
        // 添加 CORS配置信息
        CorsConfiguration config = new CorsConfiguration();
        //放行域
        config.addAllowedOrigin("*");
        //是否发送 Cookie
        config.setAllowCredentials(true);
        //放行请求方式
        config.addAllowedMethod("*");
        //放行请求头部信息
        config.addAllowedHeader("*");
        //暴露头部信息
        config.addExposedHeader(HttpHeaders.ACCEPT);
        //映射路径
        UrlBasedCorsConfigurationSource corsConfigurationSource = new UrlBasedCorsConfigurationSource();
        corsConfigurationSource.registerCorsConfiguration("/**", config);
        //返回新的CorsFilter
        return new CorsFilter(corsConfigurationSource);
    }
}
