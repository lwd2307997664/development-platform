/**
 *@expression 图片预览,重写框架里的图片显示功能
 *@author jiachw
 *@Date   create in 2019/05/30
 */
'use strict';
angular.module('hrss.si.enterprise.directivesModule')
    .service('imageCropperService', ['messageService', function (messageService) {
        /**
         * 显示图片
         * @param title     标题信息 可以为空
         * @param imageData 图片数据 支持url/data
         */
        this.showImage = function (title, imageData) {
            var modalDefaults = {
                keyboard: true,
                backdrop: true,
                modalFade: true,
                // size:'lg',
                templateUrl: 'modules/common/directives/dossierUpdate/hn-image-cropper/image-cropper-view.html',
                controller: 'imageCropperCtrl'
            };
            var modalOptions = {
                headerText: title,
                imageData: imageData,
                fileType: 'img'
            };
            return messageService.show(modalDefaults, modalOptions);
        };
        /**
         * 显示PDF
         * @param title     标题信息 可以为空
         * @param pdfSource PDF数据 支持url/dataURI
         */
        this.showPDF = function (title, pdfSource) {
            var modalDefaults = {
                keyboard: true,
                backdrop: true,
                modalFade: true,
                size: 'lg',
                templateUrl: 'modules/common/directives/dossierUpdate/hn-image-cropper/image-cropper-view.html'
            };

            var modalOptions = {
                headerText: title,
                // PDFSource: $sce.trustAsResourceUrl(pdfSource),
                fileType: 'pdf',
                pdfInit: function pdfInit() {
                    document.getElementById('objectA').data = pdfSource;
                }
            };
            return messageService.show(modalDefaults, modalOptions);
        };
    }])
    .controller('imageCropperCtrl', ['$scope', 'modalOptions', function ($scope, modalOptions) {
        var ZOOM_FACTOR = modalOptions.zoomFactor || 0.1,  //每次缩放比例
            ROTATION = modalOptions.rotate || 90, //每次旋转角度
            rotation = modalOptions.rotation || 0,//初始图片旋转角度
            STEP = 3,//旋转步长
            el = null,//声明操作元素
            touchStart = 'touchstart mousedown',//兼容手机和pc
            touchMove = 'mousemove',//监听平移动作
            touchEnd = 'mouseup mouseleave';//监听平移结束动作

        $scope.modalOptions = modalOptions;
        // 图片预览初始化
        $scope.initModel = function () {
            el = angular.element('.preview_img');
            stableContainerSize();
            updateSize('100%', '100%');
            updateRotation();
            el.on(touchStart, startListener);
        };
        // 按设置比率放大
        $scope.zoomIn = function () {
            updateSize(el.width() * (1 + ZOOM_FACTOR), el.height() * (1 + ZOOM_FACTOR));
        };
        // 按设置比率缩小
        $scope.zoomOut = function () {
            el.width() > $scope.stableWidth && updateSize(el.width() * (1 - ZOOM_FACTOR), el.height() * (1 - ZOOM_FACTOR));
        };
        // 缩放至适配容器大小
        $scope.contained = function () {
            updateSize('100%', '100%');
            //图片复位
            el.css({
                'margin-left': 0,
                'margin-top': 0
            });
        };
        // 缩放至图片的实际大小
        $scope.realSize = function () {
            //jquery 对象转dom对象
            var dom = el && el[0];
            dom && updateSize(dom.naturalWidth, dom.naturalHeight);
        };
        // 按设置旋转差顺时针旋转
        $scope.rotateImg = function () {
            stableContainerSize();
            el && requestAnimationFrame(updateRotation.bind(null, rotation, rotation += ROTATION));
        };
        var startListener = function (evt) {
            evt.preventDefault();
            stableContainerSize();//固定容器大小
            //监听手机端动作
            if (evt.type === 'touchstart') {
                touchMove = 'touchmove';
                touchEnd = 'touchend';
            }
            //获取当前鼠标位置
            var original = evt.originalEvent;
            var sx = original.clientX || original.touches[0].clientX;
            var sy = original.clientY || original.touches[1].clientY;
            var left = +el.css('margin-left').split('px')[0];
            var top = +el.css('margin-top').split('px')[0];
            //绑定平移动作和结束动作
            el.on(touchMove, moveListener({x: sx, y: sy, left: left, top: top}));
            el.on(touchEnd, endListener);
        };
        // 平移图片
        var moveListener = function (position) {
            return function (evt) {
                evt.preventDefault();
                //当前鼠标位置
                var original = evt.originalEvent;
                var mx = original.clientX || original.touches[0].clientX;
                var my = original.clientY || original.touches[0].clientY;
                //计算偏移量
                var dx = mx - position.x;
                var dy = my - position.y;
                //移动后边左边距和上边距大小
                var mLeft = position.left + dx;
                var mTop = position.top + dy;
                //计算向左平移最大距离，向上平移最大距离
                var ddx = Math.max(mLeft, $scope.stableWidth - el.width());
                var ddy = Math.max(mTop, $scope.stableHeight - el.height());
                var snapHandle = {
                    'margin-left': ddx > 0 ? 0 : ddx,//防止过度向右平移
                    'margin-top': ddy > 0 ? 0 : ddy//防止过度向下平移
                };
                //宽高转置,缺少平移范围限制
                if (rotation % 180) {
                    snapHandle = {
                        'margin-left': mLeft,
                        'margin-top': mTop
                    };
                }
                el.css(snapHandle);
            };
        };
        // 解除监听绑定
        var endListener = function () {
            console.log('end');
            el.off(touchMove);
            el.off(touchEnd);
        };
        // 设置旋转角度
        var updateRotation = function (from, to) {
            if (from < to) {
                from += STEP;
                el.css('transform', 'rotate(' + from + 'deg)');
                requestAnimationFrame(updateRotation.bind(null, from, to));
            }
            //旋转360°后，重置为0°
            if (to === 360) {
                rotation = 0;
            }
        };
        //    设置图片显示尺寸
        var updateSize = function (width, height) {
            stableContainerSize();
            //若传入的width是绝对值后加'px'；传入相对值，直接设置
            $scope.changedSize = width !== '100%';
            var w = +width;
            var h = +height;
            var props = {
                width: w === w ? w + 'px' : width,
                height: h === h ? h + 'px' : height
            };
            el.animate(props);
        };
        //    固定容器大小
        var stableContainerSize = function () {
            //是否已固定标记
            var stabled = false;
            return function () {
                if (!stabled) {
                    //img控件加载完成前，不能固定容器大小
                    if (!el[0] || !el[0].clientWidth) {
                        return;
                    }
                    $scope.stableWidth = el.width();
                    $scope.stableHeight = el.height();
                    stabled = true;
                }
            }
        }();
    }]);