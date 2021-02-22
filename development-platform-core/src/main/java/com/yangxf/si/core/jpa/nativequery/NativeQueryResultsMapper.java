/**
 * FileName: NativeQueryResultsMapper
 * Author:   Administrator
 * Date:     2021/2/20 10:03
 * Description:
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.core.jpa.nativequery;


import org.apache.commons.beanutils.BeanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 〈NativeQuery查询映射器〉<br>
 * 〈〉
 *
 * @author Administrator
 * @create 2021/2/20
 * @since 1.0.0
 */
public class NativeQueryResultsMapper {

    private NativeQueryResultsMapper() {
        // hide for utils
    }

    /** 对象映射缓存 */
    private static Map <String, MapedObjectMateData> mapCache = new HashMap <String, MapedObjectMateData>();

    /** 日志 */
    private static Logger LOGGER = LoggerFactory.getLogger(NativeQueryResultsMapper.class);

    /**
     * 映射查询结果到对象
     *
     * <pre>
     * 调用样例代码
     * {@code String sql = "select a,b from x order by a";}
     * {@code Query q = entityManager.createNativeQuery(sql);}
     * {@code query.unwrap(SQLQuery.class).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);}
     * {@code List<ClassX> results = NativeQueryResultsMapper.map(q.getResultList(), ClassX.class);}
     * </pre>
     *
     * @param objectArrayList
     * @param genericType
     * @return
     */
    public static <T> List<T> map(List<Object[]> objectArrayList, Class<T> genericType) {
        // 获取映射对象
        MapedObjectMateData objectMap = getObjectMap(genericType);
        // 检查映射数据长度
        objectMap.checkMapDataLength(objectArrayList);
        try {
            if (objectMap.isMapByColumn()) {
                return mapByColumnName(objectArrayList, genericType, objectMap);
            } else {
                return mapByIndex(objectArrayList, genericType, objectMap);
            }
        } catch (InstantiationException ie) {
            LOGGER.debug("Cannot instantiate: ", ie);
            throw new NativeQueryMapException(ie);
        } catch (IllegalAccessException iae) {
            LOGGER.debug("Illegal access: ", iae);
            throw new NativeQueryMapException(iae);
        } catch (InvocationTargetException ite) {
            LOGGER.debug("Cannot invoke method: ", ite);
            throw new NativeQueryMapException(ite);
        }
    }

    /**
     * 获取对象映射定义
     *
     * @param genericType
     * @return
     */
    private static <T> MapedObjectMateData getObjectMap(Class<T> genericType) {
        if (null == mapCache.get(genericType.getName())) {
            // 还未缓存过
            mapCache.put(genericType.getName(), new MapedObjectMateData(genericType));
        }
        return mapCache.get(genericType.getName());
    }

    /**
     * 按列顺序映射
     *
     * @param objectArrayList
     * @param genericType
     * @param objectMap
     * @return
     * @throws InstantiationException
     * @throws IllegalAccessException
     * @throws InvocationTargetException
     */
    private static <T> List<T> mapByIndex(List<Object[]> objectArrayList, Class<T> genericType,
                                          MapedObjectMateData objectMap)
            throws InstantiationException, IllegalAccessException, InvocationTargetException {
        List<T> ret = new ArrayList <T>();
        List<MapedFieldMateData> mappingFields = objectMap.getFieldList();
        // 动态将数据映射到对象
        for (Object[] objectArr : objectArrayList) {
            T t = genericType.newInstance();
            for (int i = 0; i < mappingFields.size(); i++) {
                MapedFieldMateData field = mappingFields.get(i);
                BeanUtils.setProperty(t, field.getFieldName(), objectArr[field.getIndex()]);
            }
            ret.add(t);
        }
        return ret;
    }

    /**
     * 按列名称映射
     *
     * @param objectArrayList
     * @param genericType
     * @param objectMap
     * @return
     * @throws IllegalAccessException
     * @throws InstantiationException
     * @throws InvocationTargetException
     */
    @SuppressWarnings("rawtypes")
    private static <T> List<T> mapByColumnName(List<Object[]> objectArrayList, Class<T> genericType,
                                               MapedObjectMateData objectMap)
            throws InstantiationException, IllegalAccessException, InvocationTargetException {
        List<T> ret = new ArrayList<T>();
        List<MapedFieldMateData> mappingFields = objectMap.getFieldList();
        // 动态将数据映射到对象
        for (Object objectArr : objectArrayList) {
            if (objectArr instanceof Map) {
                T rowObj = mapRowByColumnName(objectArrayList, genericType, mappingFields, (Map) objectArr);
                ret.add(rowObj);
            }
        }
        return ret;
    }

    /**
     * 映射到列
     *
     * @param objectArrayList
     * @param genericType
     * @param row
     * @param mappingFields
     * @return
     * @throws IllegalAccessException
     * @throws InvocationTargetException
     * @throws InstantiationException
     */
    private static <T> T mapRowByColumnName(List <Object[]> objectArrayList, Class<T> genericType,
                                            List<MapedFieldMateData> mappingFields, @SuppressWarnings("rawtypes") Map row)
            throws IllegalAccessException, InvocationTargetException, InstantiationException {
        T t = genericType.newInstance();
        Object s;
        for (int i = 0; i < mappingFields.size(); i++) {
            MapedFieldMateData field = mappingFields.get(i);
            s = row.get(field.getColumnName());//存在值或值不为空时才进行映射赋值
            if(null != s && !"".equals(s.toString()))
                BeanUtils.setProperty(t, field.getFieldName(), s);
        }
        return t;
    }

}
