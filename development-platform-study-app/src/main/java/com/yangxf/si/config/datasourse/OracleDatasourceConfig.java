/**
 * FileName: OracleDatasourceConfig
 * Author:   Administrator
 * Date:     2021/1/22 14:46
 * Description:
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.config.datasourse;

import com.alibaba.druid.spring.boot.autoconfigure.DruidDataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

/**
 * 〈默认数据源：oracle数据源〉<br>
 * 〈〉
 *
 * @author Administrator
 * @create 2021/1/22
 * @since 1.0.0
 */
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = {OracleDatasourceConfig.PACKAGE}
)
public class OracleDatasourceConfig {

    // oracle扫描路径
    static final String PACKAGE = "com.yangxf.si";

    @Primary
    @Bean(name = "oracleDataSource")
    @ConfigurationProperties("spring.datasource.druid.oracle")
    public DataSource oracleDataSource() {
        return DruidDataSourceBuilder.create().build();
    }


    @Bean(name = "entityManagerFactory")
    @Primary
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            EntityManagerFactoryBuilder builder) {
        LocalContainerEntityManagerFactoryBean em = builder
                .dataSource(oracleDataSource())
                .packages(new String[]{"com.yangxf.si"})
                .persistenceUnit("oracle")
                .build();
        Properties properties = new Properties();
        properties.setProperty("hibernate.ejb.naming_strategy", "org.hibernate.cfg.ImprovedNamingStrategy");
        em.setJpaProperties(properties);
        return em;
    }


    @Bean(name = "transactionManager")
    @Primary
    PlatformTransactionManager transactionManager(EntityManagerFactoryBuilder builder) {
        return new JpaTransactionManager(entityManagerFactory(builder).getObject());
    }

}
