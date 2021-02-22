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

import com.yangxf.si.core.jpa.nativequery.NativeQueryResultColumn;
import com.yangxf.si.core.jpa.nativequery.NativeQueryResultEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 〈一句话功能简述〉<br> 
 * 〈〉
 *
 * @author Administrator
 * @create 2021/2/3
 * @since 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@NativeQueryResultEntity
public class ProjectDemoDTO {

    @NativeQueryResultColumn(value = "ID")
    private String id;
    @NativeQueryResultColumn(value = "NAME")
    private String name;
    @NativeQueryResultColumn(value = "ID_NUMBER")
    private String idNumber;
    @NativeQueryResultColumn(value = "SEX")
    private String sex;
    @NativeQueryResultColumn(value = "BIRTHDAY")
    private Long birthday;

}
