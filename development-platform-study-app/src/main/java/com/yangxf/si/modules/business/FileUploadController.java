/**
 * FileName: FileUploadController
 * Author:   Administrator
 * Date:     2021/2/20 10:42
 * Description: 简单的文件上传功能实现
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.yangxf.si.modules.business;

import lombok.extern.log4j.Log4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * 〈简单的文件上传功能实现〉
 *
 * @author Administrator
 * @create 2021/2/20
 * @since 1.0.0
 */
@Log4j
@RestController
public class FileUploadController {
    SimpleDateFormat sdf = new SimpleDateFormat("/yyyy/MM/dd/");
    public static final String FILE_PATH="F:\\demotemp\\uploadFile";

    /**
     * 单个文件上传
     * @param uploadFile
     * @param request
     * @return
     */
    @PostMapping(value = "/upload")
    public String upload(MultipartFile uploadFile, HttpServletRequest request) {
        /**
         * 存放路径
         */
        String realPath = FILE_PATH;
        String format = sdf.format(new Date());
        File folder = new File(realPath + format);
        /**
         * uploadFile+/yyyy/MM/dd/,如果不存在文件夹，创建
         */
        if (!folder.isDirectory()) {
            folder.mkdirs();
        }
        String oldName = uploadFile.getOriginalFilename();//随机生成文件名
        String newName = UUID.randomUUID() + oldName.substring(oldName.lastIndexOf("."), oldName.length());//截取类型
        try {
            uploadFile.transferTo(new File(folder, newName));//上传
            String file = realPath+format+newName;
            return file;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "上传失败";
    }


    /**
     * 多个文件上传
     * @param uploadFiles
     * @param request
     * @return
     */
    @PostMapping(value = "/uploadForMults")
    public String uploadForMults(MultipartFile[] uploadFiles, HttpServletRequest request) {
        List <String> list=new ArrayList <>();
        for (MultipartFile multipartFile:uploadFiles) {
            String result=this.upload(multipartFile,request);
            if(!"上传失败".equals(result)){
                list.add(result);
            }
        }
        if(list.size()>0){
            return list.toString();
        }
        return "上传失败";
    }
}
