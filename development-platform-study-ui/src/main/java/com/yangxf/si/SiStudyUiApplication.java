package com.yangxf.si;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * 〈前台启动项〉
 *
 * @author Administrator
 * @create 2020/3/25
 * @since 1.0.0
 */
@EnableEurekaServer
@SpringBootApplication
public class SiStudyUiApplication {

    public static void main(String[] args) {
        SpringApplication.run(SiStudyUiApplication.class, args);
    }

    /**
     * 若需要通过用户名及密码访问必须添加下面的处理
     */
    @EnableWebSecurity
    static class WebSecurityConfig extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.csrf().disable().authorizeRequests()
                    .anyRequest()
                    .authenticated()
                    .and()
                    .httpBasic();
        }
    }
}