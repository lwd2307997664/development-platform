/**
 * FileName: CrossOriginController
 * Author:   Administrator
 * Date:     2021/2/23 10:30
 * Description: 局部跨域测试控制器
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.modules.business.controller.cors;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 〈一句话功能简述〉<br> 
 * 〈局部跨域测试控制器〉
 *
 * @author Adminitrator
 * @create 2021/2/23
 * @since 1.0.0
 */
@CrossOrigin("http://localhost:8081")
@RestController
public class CrossOriginController {

    @GetMapping(value="/cors/1")
    public String cors1(){
        return "跨域测试1";
    }

    @CrossOrigin(value="http://localhost:8082")
    @GetMapping(value="/cors/2")
    public String cors2(){
        return "跨域测试2";
    }
}
