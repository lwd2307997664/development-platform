/**
 * FileName: ProjectDemoControllerTest
 * Author:   Administrator
 * Date:     2021/2/4 10:22
 * Description:
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.modules.business.controller;

import lombok.extern.log4j.Log4j;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;


/**
 * 〈单元测试〉<br>
 * 〈〉
 *
 * @author Administrator
 * @create 2021/2/4
 * @since 1.0.0
 */
@DisplayName("单元测试类")
@SpringBootTest
@Log4j
public class ProjectDemoControllerTest {

    @Test
    @BeforeAll
    public static void beforeAll() {
        log.info("@BeforeAll: 表示在所有单元测试之前执行");
    }

    @BeforeEach
    public void beforeEach() {
        log.info("@BeforeEach: 表示在每个单元测试之前执行行");
    }

    @Test
    @DisplayName("测试方法一")
    public void testOne() {
        log.info("@DisplayName: 为测试类或者测试方法设置展示名称");
    }

    @DisplayName("测试方法二")
    @RepeatedTest(3)
    public void testTwo() {
        log.info("@RepeatedTest: 表示测试方法循环测试");
    }

    @Test
    @AfterAll
    public static void AfterAll() {
        log.info("@AfterAll: 表示在所有单元测试之后执行");
    }

    @AfterEach
    public void AfterEach() {
        log.info("@AfterEach: 表示在每个单元测试之后执行行");
    }
}
