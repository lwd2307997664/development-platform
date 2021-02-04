/**
 * FileName: ProjectDemoDTO
 * Author:   Administrator
 * Date:     2021/2/3 9:56
 * Description:
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.modules.business.controller;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 〈一句话功能简述〉<br> 
 * 〈〉
 *
 * @author Administrator
 * @create 2021/2/3
 * @since 1.0.0
 */
@Data
@AllArgsConstructor
public class ProjectDemoDTO {

    private String name;

    private String idNumber;

    private String sex;

    private Long birthday;

}
