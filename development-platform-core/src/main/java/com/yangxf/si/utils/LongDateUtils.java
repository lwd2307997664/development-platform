package com.yangxf.si.utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 用Long表示的时间格式化工具类
 *
 * @author lin.wd
 */
public class LongDateUtils {

    /**
     * 格式化时间到秒
     */
    private static final String DATE_FORMAT_TO_SECOND = "yyyyMMddHHmmss";

    /**
     * 格式化时间到天
     */
    private static final String DATE_FORMAT_TO_DAY = "yyyyMMdd";

    /**
     * 格式化时间到月
     */
    private static final String DATE_FORMAT_TO_MONTH = "yyyyMM";

    /**
     * 验证8位字符串是否为日期的正则表达式
     */
    private static final String DAY_REGX = "(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)";

    private static final Pattern DAY_PATTERN = Pattern.compile(DAY_REGX);

    /**
     * 验证8位字符串是否为日期的正则表达式
     */
    private static final String SECOND_REGX = "(((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229))([01][0-9]|2[0-3])[0-5][0-9][0-5][0-9])";

    private static final Pattern SECOND_PATTERN = Pattern.compile(SECOND_REGX);

    /**
     * 验证6位字符串是否为日期的正则表达式
     */
    private static final String MONTH_REGX = "([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(0[1-9]|1[0-2])";

    private static final Pattern MONTH_PATTERN = Pattern.compile(MONTH_REGX);

    /**
     * 工具类隐藏构造函数
     */
    private LongDateUtils() {
        // hide
    }

    /**
     * 将日期格式化为精度到秒yyyyMMddHHmmss的String格式
     *
     * @param date
     * @return
     */
    public static String toSecondString(Date date) {
        if (null == date) {
            return null;
        }
        SimpleDateFormat dateformat = new SimpleDateFormat(
                DATE_FORMAT_TO_SECOND);
        return dateformat.format(date);
    }

    /**
     * 将日期格式化为精度到秒yyyyMMddHHmmss的Long格式
     *
     * @param date
     * @return
     */
    public static Long toSecondLong(Date date) {
        if (null == date) {
            return null;
        } else {
            return Long.parseLong(toSecondString(date));
        }
    }

    /**
     * 将日期格式化为精度到天yyyyMMdd的String格式
     *
     * @param date
     * @return
     */
    public static String toDayString(Date date) {
        if (null == date) {
            return null;
        }
        SimpleDateFormat dateformat = new SimpleDateFormat(DATE_FORMAT_TO_DAY);
        return dateformat.format(date);
    }

    /**
     * 将日期格式化为精度到天yyyyMMdd的Long格式
     *
     * @param date
     * @return
     */
    public static Long toDayLong(Date date) {
        if (null == date) {
            return null;
        } else {
            return Long.parseLong(toDayString(date));
        }
    }

    /**
     * 将日期格式化为精度到月yyyyMM的String格式
     *
     * @param date
     * @return
     */
    public static String toMonthString(Date date) {
        if (null == date) {
            return null;
        }
        SimpleDateFormat dateformat = new SimpleDateFormat(DATE_FORMAT_TO_MONTH);
        return dateformat.format(date);
    }

    /**
     * 将日期格式化为精度到月yyyyMM的Long格式
     *
     * @param date
     * @return
     */
    public static Long toMonthLong(Date date) {
        if (null == date) {
            return null;
        } else {
            return Long.parseLong(toMonthString(date));
        }
    }

    /**
     * 判断传入Long是否是日期
     *
     * @param value
     * @return
     */
    public static boolean isDate(Long value) {
        return isSecondLongDate(value) || isDayLongDate(value)
                || isMonthLongDate(value);
    }

    /**
     * 验证六位位long型是否为有效时间
     *
     * @param value
     * @return
     */
    public static boolean isMonthLongDate(long value) {
        String date = String.valueOf(value);
        Matcher mat = MONTH_PATTERN.matcher(date);
        return mat.matches();
    }

    /**
     * 验证十四位long型是否为有效时间
     *
     * @param value
     * @return
     */
    public static boolean isSecondLongDate(long value) {
        String date = String.valueOf(value);
        Matcher mat = SECOND_PATTERN.matcher(date);
        return mat.matches();
    }

    /**
     * 验证八位位long型是否为有效时间
     *
     * @param value
     * @return
     */
    public static boolean isDayLongDate(long value) {
        String date = String.valueOf(value);
        Matcher mat = DAY_PATTERN.matcher(date);
        return mat.matches();
    }

    /**
     * 将精度到天的long型参数转换为Date型
     *
     * @param value
     * @return
     */
    public static Date dayLongToDate(Long value) {
        if (!isDayLongDate(value)) {
            throw new java.lang.IllegalArgumentException("传入参数不是精度到天的有效时间");
        }
        int year = Integer.parseInt(String.valueOf(value).substring(0, 4));
        int month = Integer.parseInt(String.valueOf(value).substring(4, 6)) - 1;
        int day = Integer.parseInt(String.valueOf(value).substring(6, 8));
        Calendar cal = Calendar.getInstance();
        cal.set(year, month, day, 0, 0, 0);
        return cal.getTime();
    }

    /**
     * 将精度到秒的long型参数转换为Date型
     *
     * @param value
     * @return
     */
    public static Date secondLongToDate(Long value) {
        if (!isSecondLongDate(value)) {
            throw new java.lang.IllegalArgumentException("传入参数不是精度到秒的有效时间");
        }
        int year = Integer.parseInt(String.valueOf(value).substring(0, 4));
        int month = Integer.parseInt(String.valueOf(value).substring(4, 6)) - 1;
        int day = Integer.parseInt(String.valueOf(value).substring(6, 8));
        int hour = Integer.parseInt(String.valueOf(value).substring(8, 10));
        int minute = Integer.parseInt(String.valueOf(value).substring(10, 12));
        int second = Integer.parseInt(String.valueOf(value).substring(12, 14));
        Calendar cal = Calendar.getInstance();
        cal.set(year, month, day, hour, minute, second);
        return cal.getTime();
    }

    /**
     * 将有效long型参数转换为Date型，精确到月
     *
     * @param value
     * @return
     */
    public static Date monthLongToDate(long value) {
        if (!isMonthLongDate(value)) {
            throw new java.lang.IllegalArgumentException("传入参数不是精度到月的有效时间");
        }
        int year = Integer.parseInt(String.valueOf(value).substring(0, 4));
        int month = Integer.parseInt(String.valueOf(value).substring(4, 6)) - 1;
        Calendar cal = Calendar.getInstance();
        cal.set(year, month, 1, 0, 0, 0);
        return cal.getTime();
    }

    /**
     * 获取当前时间为秒
     *
     * @return
     */
    public static Long nowAsSecondLong() {
        return LongDateUtils.toSecondLong(new Date());
    }

    /**
     * 获取当前时间为天
     *
     * @return
     */
    public static Long nowAsDayLong() {
        return LongDateUtils.toDayLong(new Date());
    }

    /**
     * 获取当前时间为月
     *
     * @return
     */
    public static Long nowAsMonthLong() {
        return LongDateUtils.toMonthLong(new Date());
    }

}
