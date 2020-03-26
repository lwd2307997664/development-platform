/**
 * 图片上传（高拍模块）
 *
 * @author Erwin
 * @date 2016/8/22
 */
'use strict';

angular.module('hrss.si.enterprise.directivesModule')
  .controller('imgUpdateCameraController', ['$scope', '$log', '$uibModalInstance', 'widgetId',
    function ($scope, $log, $uibModalInstance, widgetId) {
      //高拍成像参数
      var CAMERA_PARAM = {
        CompressionRatio: 0.5, //压缩率
        RefreshRate: 300  //刷新率（毫秒）
      };

      var socket;
      //照片数据
      var photoData;
      //是否是成功消息
      var isRead = false;
      //ws连接串
      var HOST = 'ws://127.0.0.1:10011/';
      //初始化手势控制
      $scope.isHand = {catch: true, confirm: false, reset: false};


      //初始化
      $scope.imgDate = null;
      socket = new WebSocket(HOST);

      socket.onmessage = function (msg) {
        if (typeof msg.data == "string" && msg.data.length > 1) {
          if (isRead === false) {
            if (msg.data.indexOf('连接成功' != -1)) {
              isRead = true;
            }
          }
          else {
            document.getElementById("dossierImgCamera").src = "data:image/png;base64," + msg.data;
          }
        }
      };

      socket.onopen = function () {
        sendStart();
      };

      socket.onclose = function () {
        // alert("socket 关闭!")
      };


      /**
       * 发送Start消息
       */
      var sendStart = function () {
        var optionStr = "{'Method':'StartCamera', 'Parm1':" + CAMERA_PARAM.CompressionRatio + ", 'Parm2':" + CAMERA_PARAM.RefreshRate + ",'Parm3':'', 'Parm4':''}";
        socket.send(optionStr);
        $log.debug('您将要开始图像传输：', optionStr);
      };

      /**
       * 发送Stop消息
       */
      var sendStop = function () {
        var optionStr = "{'Method':'StopCamera', 'Parm1':'', 'Parm2':'','Parm3':'', 'Parm4':''}";
        socket.send(optionStr);
        $log.debug('您将要停止图像传输：', optionStr);
      };

      /**
       * 关闭socket连接
       */
      var socketClose = function () {
        if (socket != null) {
          socket.close();
        }
      };


      /**
       * 监听关闭浏览器事件
       */
      // window.onbeforeunload = function () {
      //   try {
      //     socket.close();
      //   }
      //   catch (ex) {
      //   }
      // };



      /**
       * 页面初始化完成
       */
      $scope.viewInit = function(){
        $('#imgUpdateCamera').parent().css('padding','0')
      };


      /**
       * 关闭窗口
       */
      $scope.close = function () {
        socket.send("{'Method':'StopCamera', 'Parm1':'', 'Parm2':'','Parm3':'', 'Parm4':''}");
        // socketClose();
        $uibModalInstance.dismiss('cancel');
      };

      /**
       * 拍照
       */
      $scope.catch = function () {
        if ($scope.isHand.catch === true) {
          sendStop();
          photoData = document.getElementById("dossierImgCamera").src;
          $scope.isHand = {catch: false, confirm: true, reset: true};
          $log.debug('拍照成功！');
        }
      };

      /**
       * 重置
       */
      $scope.reset = function () {
        if (photoData === null || angular.isUndefined(photoData) || $scope.isHand.reset === false) {
          return;
        }
        sendStop();
        setTimeout(sendStart, 300);
        $scope.isHand = {catch: true, confirm: false, reset: false};
      };

      /**
       * 确定
       */
      $scope.confirm = function () {
        // $log.debug('photoData', photoData);
        if (photoData === null || angular.isUndefined(photoData) || $scope.isHand.confirm === false) {
          return;
        }
        $uibModalInstance.close(photoData);
      };

      /**
       * 切换摄像头
       */
      $scope.switch = function () {
        if ($scope.isHand.catch === false) {
          return;
        }
        var optionStr = "{'Method':'SwitchDevice', 'Parm1':'', 'Parm2':'','Parm3':'', 'Parm4':''}";
        socket.send(optionStr);
        $log.debug('将要切换摄像头：',optionStr);
      };

    }]);
