/**
 *@expression 重写图片压缩指令
 *@author jiachw
 *@Date   create in 2019/06/04
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule').directive('girderImageCompress2', ['$q', 'imageCompressService', function ($q, imageCompressService) {
    var directive = {
        restrict: 'A',
        scope: {
            image: '=',
            resizeMaxHeight: '@?',
            resizeMaxWidth: '@?',
            resizeQuality: '@?',
            resizeType: '@?',
            isPdf: '='
        },
        link: function postLink(scope, element, attrs) {
            var doResizing = function doResizing(imageResult, callback) {
                imageCompressService.compress(imageResult.url, scope, function (dataURLcompressed) {
                    imageResult.compressed = {
                        dataURL: dataURLcompressed,
                        type: dataURLcompressed.split(';')[0].split(':')[1],
                        getBlob: function getBlob() {
                            return dataURItoBlob(this.dataURL);
                        }
                    };
                    callback(imageResult);
                });
            };

            var applyScope = function applyScope(imageResult) {
                scope.$apply(function () {
                    //console.log(imageResult);
                    if (attrs.multiple) {
                        scope.image.push(imageResult);
                    } else {
                        scope.image = imageResult;
                    }
                });
            };

            element.bind('change', function (evt) {
                //when multiple always return an array of images
                if (attrs.multiple) {
                    scope.image = [];
                }

                var files = evt.target.files;
                scope.isPdf = files[0].name.match(/\.([^\.]+)$/)[1].toLocaleUpperCase() === 'PDF';
                for (var i = 0; i < files.length; i++) {
                    //create a result object for each file in files
                    var imageResult = {
                        file: files[i],
                        url: scope.isPdf ? '' : URL.createObjectURL(files[i])
                    };

                    fileToDataURL(files[i]).then(function (dataURL) {
                        imageResult.dataURL = dataURL;

                        if (scope.isPdf) {
                            imageResult.compressed = {
                                dataURL: dataURL,
                                type: 'application/pdf',
                                getBlob: function getBlob() {
                                    return dataURItoBlob(dataURL);
                                }
                            };
                            scope.image = imageResult;
                        }
                    });

                    if (scope.isPdf) {
                        return;
                    }

                    if (scope.resizeMaxHeight || scope.resizeMaxWidth) {
                        //resize image
                        doResizing(imageResult, function (imageResult) {
                            applyScope(imageResult);
                        });
                    } else {
                        //no resizing
                        applyScope(imageResult);
                    }
                }
            });
        }
    };

    var URL = window.URL || window.webkitURL;

    var getResizeArea = function getResizeArea() {
        var resizeAreaId = 'fileupload-resize-area';

        var resizeArea = document.getElementById(resizeAreaId);

        if (!resizeArea) {
            resizeArea = document.createElement('canvas');
            resizeArea.id = resizeAreaId;
            resizeArea.style.visibility = 'hidden';
            document.body.appendChild(resizeArea);
        }

        return resizeArea;
    };

    //将base64转换为Blob
    var dataURItoBlob = function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]); else byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {type: mimeString});
    };

    /**
     * Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed
     * @param {Image} sourceImgObj The source Image Object
     * @param {Integer} quality The output quality of Image Object
     * @return {Image} result_image_obj The compressed Image Object
     */

    var jicCompress = function jicCompress(sourceImgObj, options, callback) {
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
    };

    var resizeImage = function resizeImage(origImage, options) {
        var maxHeight = options.resizeMaxHeight || 300;
        var maxWidth = options.resizeMaxWidth || 250;
        var quality = options.resizeQuality || 0.7;
        var type = options.resizeType || 'image/jpg';

        var canvas = getResizeArea();

        var height = origImage.height;
        var width = origImage.width;

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

        canvas.width = width;
        canvas.height = height;

        //draw image on canvas
        var ctx = canvas.getContext('2d');
        ctx.drawImage(origImage, 0, 0, width, height);

        // get the data from canvas as 70% jpg (or specified type).
        return canvas.toDataURL(type, quality);
    };

    var createImage = function createImage(url, callback) {
        var image = new Image();
        image.onload = function () {
            callback(image);
        };
        image.src = url;
    };

    var fileToDataURL = function fileToDataURL(file) {
        var deferred = $q.defer();
        var reader = new FileReader();
        reader.onload = function (e) {
            deferred.resolve(e.target.result);
        };
        reader.readAsDataURL(file);
        return deferred.promise;
    };

    return directive;
}]);