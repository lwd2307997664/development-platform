/**
 * FileName: MapedObjectMateData
 * Author:   Administrator
 * Date:     2021/2/20 10:01
 * Description:
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.core.jpa.nativequery;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * 〈映射对象元数据〉<br>
 * <pre>
 * 映射对象元数据必须由{@code @NativeQueryResultEntity}注解
 * </pre>
 *
 * @author Administrator
 * @create 2021/2/20
 * @since 1.0.0
 */
public class MapedObjectMateData {

    /** 日志 */
    private static Logger LOGGER = LoggerFactory.getLogger(MapedObjectMateData.class);

    /** 映射对象类名 */
    private String className;

    /** 映射列 */
    private List <MapedFieldMateData> fieldList;

    /** 对象映射方式 */
    private NativeQueryMapType mapType;

    /**
     * 映射对象元数据构造函数
     *
     * @param genericType
     */
    public <T> MapedObjectMateData(Class<T> genericType) {
        // 确定是否是映射对象
        this.mapType = getMapType(genericType);
        // 获得对象类名
        this.className = genericType.getName();
        this.fieldList = praseFieldList(genericType);
        // 校验映射定义
        validatFieldListDefine();
    }

    public String getClassName() {
        return className;
    }

    public List<MapedFieldMateData> getFieldList() {
        return Collections.unmodifiableList(fieldList);
    }

    /**
     * 解析映射对象数据映射情况
     *
     * @return
     */
    private <T> List<MapedFieldMateData> praseFieldList(Class<T> genericType) {
        Field[] fields = genericType.getDeclaredFields();
        List<MapedFieldMateData> mapedFieldList = new ArrayList <MapedFieldMateData>();
        for (int i = 0; i < fields.length; i++) {
            if (fields[i].isAnnotationPresent(NativeQueryResultColumn.class)) {
                mapedFieldList.add(new MapedFieldMateData(fields[i]));
            }
        }
        return mapedFieldList;
    }

    /**
     * 确定是否传入映射对象
     *
     * @param genericType
     * @return
     */
    private <T> NativeQueryMapType getMapType(Class<T> genericType) {
        if (!genericType.isAnnotationPresent(NativeQueryResultEntity.class)) {
            throw new NativeQueryMapException("未申明NativeQueryResultEntity注解" + genericType.getName());
        }
        NativeQueryResultEntity entity = genericType.getAnnotation(NativeQueryResultEntity.class);
        return entity.mapType();
    }

    /**
     * 是否按列映射
     *
     * @return
     */
    public boolean isMapByColumn() {
        return NativeQueryMapType.BY_COLUMN_NAME.equals(this.mapType);
    }

    /**
     * 如果数据长度大于映射长度时则警告
     *
     * @param objectArrayList
     */
    public void checkMapDataLength(final List<Object[]> objectArrayList) {
        // 如果有数据传入而且数据长度大于映射长度时警告
        int dataLength = this.getDataLength(objectArrayList);
        if (dataLength > 0 && this.getFieldList().size() < dataLength) {
            Object[] param = { this.getClassName(), this.getFieldList().size(), dataLength };
            LOGGER.warn("{}对象映射定义长度为{}传入数据长度为{}(请检查是否为程序错误)", param);
        }
    }

    /**
     * 获取输入数据长度
     *
     * @param objectArrayList
     * @return
     */
    @SuppressWarnings("rawtypes")
    private int getDataLength(final List<Object[]> objectArrayList) {
        if (objectArrayList.size() > 1) {
            Object obj = objectArrayList.get(0);
            if (obj instanceof Map) {
                return ((Map) obj).size();
            } else {
                return objectArrayList.get(0).length;
            }
        }
        return 0;
    }

    /**
     * 检查数据列定义
     *
     * <pre>
     * 为了减少编码的错误，检查数据列定义是否存在列名相同或者索引定义相同(多个大于0相同的)的
     * </pre>
     */
    private void validatFieldListDefine() {
        boolean isMapedByColumn = false;
        if (NativeQueryMapType.BY_COLUMN_NAME.equals(mapType)) {
            isMapedByColumn = true;
        }
        for (MapedFieldMateData field : fieldList) {
            if (isMapedByColumn) {
                validatFieldItemDefineByColumn(field);
            } else {
                validatFieldItemDefineByIndex(field);
            }

        }
    }

    /**
     * 检查按列映射
     *
     * @param field
     */
    private void validatFieldItemDefineByColumn(MapedFieldMateData field) {
        for (MapedFieldMateData otherfield : fieldList) {
            if (!field.equals(otherfield)) {
                if (field.getColumnName().equals(otherfield.getColumnName())) {
                    Object[] param = { className, field.getFieldName(), otherfield.getFieldName(),
                            field.getColumnName() };
                    LOGGER.warn("在类{}映射定义中{}与{}列名定义相同为{}(请检查是否为程序错误)", param);
                }
            }
        }
    }

    /**
     * 检查按索引映射
     *
     * @param field
     */
    private void validatFieldItemDefineByIndex(MapedFieldMateData field) {
        for (MapedFieldMateData otherfield : fieldList) {
            if (!field.equals(otherfield) && (field.getIndex() == otherfield.getIndex())) {
                Object[] param = { className, field.getFieldName(), otherfield.getFieldName(), field.getIndex() };
                LOGGER.warn("在类{}映射定义中{}与{}索引定义相同为{}(请检查是否为程序错误)", param);
            }
        }
    }
}
