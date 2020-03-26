/**
 *@expression 校正图片自动旋转
 *@author jiachw
 *@Date   create in 2019/06/05
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
    .service('imageCompressService', [function () {
        this.compress = function (imgUrl, options, callback) {
            var img = new Image();
            img.onload = function () {
                exifTransform(img, options, callback);
            };
            img.src = imgUrl;
        };
        var exifTransform = function (sourceImgObj, options, callback) {

            var outputFormat = options.resizeType;
            var quality = options.resizeQuality * 100 || 70;
            var mimeType = 'image/jpeg';
            if (outputFormat !== undefined && outputFormat === 'png') {
                mimeType = 'image/png';
            }

            var maxHeight = options.resizeMaxHeight || 300;
            var maxWidth = options.resizeMaxWidth || 250;

            var height = sourceImgObj.height;
            var width = sourceImgObj.width;

            // calculate the width and height, constraining the proportions
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round(height *= maxWidth / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round(width *= maxHeight / height);
                    height = maxHeight;
                }
            }

            var cvs = document.createElement('canvas');
            var ctx = cvs.getContext('2d');
            //将图片旋转到正常角度
            EXIF.getData(sourceImgObj, function () {
                var orientation = EXIF.getTag(this, 'Orientation');
                switch (orientation) {
                    case 6://照片顺时针旋转90°,画布长宽转置
                        cvs.width = height; //sourceImgObj.naturalWidth;
                        cvs.height = width; //sourceImgObj.naturalHeight;
                        ctx.rotate(Math.PI / 2);
                        ctx.drawImage(sourceImgObj, 0, -height, width, height);
                        break;
                    case 3://照片旋转180°,画布旋转180
                        cvs.width = width; //sourceImgObj.naturalWidth;
                        cvs.height = height; //sourceImgObj.naturalHeight;
                        ctx.rotate(Math.PI);
                        ctx.drawImage(sourceImgObj, -width, -height, width, height);
                        break;
                    case 8://照片逆时针旋转90°,画布长宽转置
                        cvs.width = height; //sourceImgObj.naturalWidth;
                        cvs.height = width; //sourceImgObj.naturalHeight;
                        ctx.rotate(-Math.PI / 2);
                        ctx.drawImage(sourceImgObj, -width, 0, width, height);
                        break;
                    default:
                        cvs.width = width; //sourceImgObj.naturalWidth;
                        cvs.height = height; //sourceImgObj.naturalHeight;
                        ctx.drawImage(sourceImgObj, 0, 0, width, height);
                        break;
                }
                var newImageData = cvs.toDataURL(mimeType, quality / 100);
                callback(newImageData);
            });
        }
    }]);