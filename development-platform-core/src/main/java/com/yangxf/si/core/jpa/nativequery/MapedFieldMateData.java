/**
 * FileName: MapedFieldMateData
 * Author:   Administrator
 * Date:     2021/2/20 9:59
 * Description:
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.core.jpa.nativequery;


import org.apache.commons.lang3.StringUtils;

import java.lang.reflect.Field;

/**
 * 〈映射字段元数据〉<br>
 * <pre>
 * 映射字段必须是由{@Code @NativeQueryResultColumn} 注解的字段
 * </pre>
 * @author Administrator
 * @create 2021/2/20
 * @since 1.0.0
 */
public class MapedFieldMateData {

    /** 列 */
    private Field field;
    /** 列名 */
    private String columnName;
    /** 列索引 */
    private int index;

    /**
     * 构造函数
     *
     * @param mapedfield
     */
    public MapedFieldMateData(final Field mapedfield) {
        NativeQueryResultColumn nqrc = mapedfield.getAnnotation(NativeQueryResultColumn.class);
        this.field = mapedfield;
        // 计算 列名与索引
        this.columnName = getMapColumnName(nqrc);
        this.index = nqrc.index();

    }

    public Field getField() {
        return field;
    }

    public String getFieldName() {
        return field.getName();
    }

    public String getColumnName() {
        return columnName;
    }

    public int getIndex() {
        return index;
    }

    /**
     * 获得映射列名
     *
     * @param nqrc
     * @return
     */
    private String getMapColumnName(NativeQueryResultColumn nqrc) {
        if (!StringUtils.isBlank(nqrc.value())) {
            return nqrc.value().toUpperCase();
        } else {
            return field.getName().toUpperCase();
        }
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((field == null) ? 0 : field.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        MapedFieldMateData other = (MapedFieldMateData) obj;
        if (field == null) {
            if (other.field != null) {
                return false;
            }
        } else if (!field.equals(other.field)) {
            return false;
        }
        return true;
    }

}
