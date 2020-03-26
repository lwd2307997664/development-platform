/**
 * Created by Erwin on 2017/5/16 0016.
 * 图像预览service
 */
// 'use strict';
angular.module('hrss.si.enterprise.directivesModule')
  .factory('imgActiveService', ['$log', '$q', '$http', 'girderConfig', 
    function ($log, $q, $http, appConfig) {
      var factory = {};
      var obj;
      var blobId;
      var rtn;
      var NDCMSInterface;
      var GWScan;
      var resizeTimer = null;

      var defer = $q.defer();


      this.init = function () {
        // var divGWScanInnerHTML = '<object id="GWScan" classid="clsid:9D351AAD-54EA-4E90-A402-2B6C05186908" style="width: 100%;height: 100%;display: none"></object>';
        var divgwscan = document.getElementById('divgwscan');
        try {
          NDCMSInterface = new ActiveXObject("GWScan.NDCMSInterface");
          // NDCMSInterface.SetUploadUrl('http://' + AMUConfig.dossierAddress.webServeHost, AMUConfig.dossierAddress.content);
        } catch (e) {
          var noRegActiveXHTML = '</br></br></br><div class="c_red text_c f16p">未安装采集控件或浏览器设置错误，请使用IE10或以上版本浏览器</br></br>';
          noRegActiveXHTML += '<a href="' + appConfig.baseUrl + '/download/GWScanSetup.exe" class="c_blue_2">点此下载安装采集控件</a></br></br>';
          noRegActiveXHTML += '如安装后无法正常采集，请安装.net framework 3.5后重新安装</br></br>';
          noRegActiveXHTML += '<a href="' + appConfig.baseUrl + '/download/dotNetFx35Win7.exe" class="c_blue_2">点此下载.net framework 3.5 Windows7</a></br></br>';
          noRegActiveXHTML += '<a href="' + appConfig.baseUrl + '/download/dotNetFx35Win10.zip" class="c_blue_2">点此下载.net framework 3.5 Windows10</a></br></br>';
          noRegActiveXHTML += '<a href="' + appConfig.baseUrl + '/download/IE11Win7x64.exe" class="c_blue_2">点此下载IE11 Windows7 X64</a></br></br>';
          noRegActiveXHTML += '</div></br></br></br>';
          divgwscan.innerHTML = noRegActiveXHTML;
          return;
        }

        var divGWScanDom = document.createElement('object');
        divGWScanDom.id = 'GWScan';
        divGWScanDom.classid = 'clsid:9D351AAD-54EA-4E90-A402-2B6C05186908';
        divGWScanDom.style.height = '100%';
        divGWScanDom.style.width = '100%';
        // divGWScanDom.style.display =  'none';

        divgwscan.appendChild(divGWScanDom);
        GWScan = document.getElementById('GWScan');


        GWScan.Init();


        if (typeof JSON !== 'object') {
          JSON = {};
        }


        (function () {
          function f(n) {
            return n < 10 ? '0' + n : n;
          }

          if (typeof Date.prototype.toJSON !== 'function') {
            Date.prototype.toJSON = function (key) {
              return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null;
            };
            String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
              return this.valueOf();
            };
          }
          var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap, indent, meta = {
              '\b': '\\b',
              '\t': '\\t',
              '\n': '\\n',
              '\f': '\\f',
              '\r': '\\r',
              '"': '\\"',
              '\\': '\\\\'
            },
            rep;

          function quote(string) {
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
              var c = meta[a];
              return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
          }

          function str(key, holder) {
            var i, k, v, length, mind = gap,
              partial, value = holder[key];
            if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
              value = value.toJSON(key);
            }
            if (typeof rep === 'function') {
              value = rep.call(holder, key, value);
            }
            switch (typeof value) {
              case 'string':
                return quote(value);
              case 'number':
                return isFinite(value) ? String(value) : 'null';
              case 'boolean':
              case 'null':
                return String(value);
              case 'object':
                if (!value) {
                  return 'null';
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                  length = value.length;
                  for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                  }
                  v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                  gap = mind;
                  return v;
                }
                if (rep && typeof rep === 'object') {
                  length = rep.length;
                  for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                      k = rep[i];
                      v = str(k, value);
                      if (v) {
                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                      }
                    }
                  }
                } else {
                  for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                      v = str(k, value);
                      if (v) {
                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                      }
                    }
                  }
                }
                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
            }
          }

          if (typeof JSON.stringify !== 'function') {
            JSON.stringify = function (value, replacer, space) {
              var i;
              gap = '';
              indent = '';
              if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                  indent += ' ';
                }
              } else if (typeof space === 'string') {
                indent = space;
              }
              rep = replacer;
              if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
              }
              return str('', {
                '': value
              });
            };
          }
          if (typeof JSON.parse !== 'function') {
            JSON.parse = function (text, reviver) {
              var j;

              function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                  for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                      v = walk(value, k);
                      if (v !== undefined) {
                        value[k] = v;
                      } else {
                        delete value[k];
                      }
                    }
                  }
                }
                return reviver.call(holder, key, value);
              }

              text = String(text);
              cx.lastIndex = 0;
              if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                  return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
              }
              if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function' ? walk({
                  '': j
                }, '') : j;
              }
              throw new SyntaxError('JSON.parse');
            };
          }
        }());

        Date.prototype.format = function (format) {
          var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "f": this.getMilliseconds() //millisecond
          };

          if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
          }

          for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
              format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
          }
          return format;
        };

        /*
         //APIs
         string Test(string inString);
         string Scan();
         string SetWorkFolder(string path);
         string GetWorkFolder();
         string GetAll();
         string GetAllJson();
         string GetSelected();
         string GetSelectedJson();
         string DeleteAll();
         string DeleteSelected();
         string DeleteByIndex(string index);
         string RefreshList();
         string SetImageNameStartWith(string imageNameStartWith);
         string SetImageExtension(string imageExtension);
         string SelectAll();
         string SelectNone();
         string SelectInvers();
         string RotateLeft();
         string RotateRight();
         string Import();
         string Export();
         string Setting();
         string ShowTree();
         string DataSourceManager();
         string SetDataSource(string dataSource);
         string SetQuality(string quality);
         string SetResolution(string dpi);
         string Close();
         string SetImageNameMode(string mode);
         string SetRotation(string direction);
         string SetAutoCutEgde(string autoCut);
         */

        GWScan.SetImageNameMode("1");
        GWScan.SetImageNameStartWith("P");
        GWScan.SetImageExtension("jpg");
        GWScan.SetQuality("40");
        GWScan.SetResolution("300");
        GWScan.SetImageColorMode("0");

        this.doResize();
        //obj = document.getElementById("GWScan");

        //GWScan.ShowTree();
        //alert("选择工作文件夹. ");
        //        var storage = window.localStorage;
        //        if (!storage.getItem("GWScanWorkFolder")) {
        //          alert("选择临时文件工作文件夹. ");
        //          storage.setItem("GWScanWorkFolder", GWScan.SetWorkFolder(""));
        //        } else {
        //          GWScan.SetWorkFolder(storage.getItem("GWScanWorkFolder"));
        //        }
        //
        //        if (!storage.getItem("GWScanDataSource")) {
        //          storage.setItem("GWScanDataSource", GWScan.DataSourceManager());
        //        } else {
        //          GWScan.SetDataSource(storage.getItem("GWScanDataSource"));
        //        }
        //
        //        GWScan.SetImageNameMode("1");
        //        GWScan.SetImageNameStartWith("P");
        //        GWScan.SetImageExtension("jpg");
        //        GWScan.SetQuality("80");
        //        GWScan.SetResolution("300");
        //         console.log('GWScan.version():', GWScan.Version());
      };

      /**
       * 获取activeX最新版本
       * @returns {*}
       */
      function getGWScanNewVersion() {
        return $http({
          method: 'GET',
          url: appConfig.baseUrl + '/download/version.json'
        });
      }

      /**
       * 当前版本是否为最新版本
       */
      this.isSameVersion = function () {
        var versionDefer = $q.defer();
        //新版本
        var newVersion = GWScan.Version();
        getGWScanNewVersion().success(function (currentVersion) {
          versionDefer.resolve(currentVersion.GWScan === newVersion);
          console.log('datadatadatadatadatadatadatadatadatadata', newVersion, currentVersion)
        }).error(function () {
          versionDefer.resolve(null);
        });
        return versionDefer.promise;
      };


      this.getSettingOption = function () {
        return JSON.parse(GWScan.GetSetting());
      };

      this.getFiles = function () {
        return this.GetList();
      };

      this.GetList = function () {
        var filelist = new Array();
        var pics = GWScan.GetSelectedJson();
        alert(pics);
        var picsJson = JSON.parse(pics);
        //for(var p in picsJson){
        //	alert(p + " " + picsJson[p]);
        //}
        var obj = JSON.parse(pics);
        alert(picsJson.Count);

        for (var i = 0; i < picsJson.Count; i++) {
          filelist.push(picsJson.Files[i]);
          // alert(picsJson.Files[i]);
        }
        //picsJson.Files.forEach(function(e){
        //   filelist.push(""+e);
        //   alert(""+e);
        //})
        return filelist;
      };

      this.getFilesAll = function () {
        var filelist = new Array();
        var pics = new Array();
        var picsAll = GWScan.GetAll();
        alert(picsAll);
        if (picsAll == null || picsAll == "") {
          return;
        }
        pics = picsAll.split("|");
        var picCount = pics.length;
        alert(picCount);
        if (picCount > 0) {
          for (var i = 0; i < picCount; i++) {
            filelist.push(pics[i]);
            alert(pics[i]);
          }
        }
        //pics.forEach(function(e){
        //   filelist.push(""+e);
        //   alert(""+e);
        //})
        return filelist;
      };

      this.doResize = function () {
        // document.body.style.marginLeft = "0px";
        // document.body.style.marginTop = "0px";
        // //document.getElementById('GWScan').setAttribute("width", document.documentElement.clientWidth + "px");
        // document.getElementById('GWScan').setAttribute("height", (document.documentElement.clientHeight - 340) + "px");
        // var activeXWidth = document.getElementById('GWScan').getAttribute("height")/3*4;
        // //alert(activeXWidth);
        // document.getElementById('GWScan').setAttribute("width", activeXWidth + "px");
        // document.getElementById('GWScan').parentNode.parentNode.style.width = activeXWidth + "px";
        //
        // //alert(document.getElementById('GWScan').getAttribute("width")+", "+document.getElementById('GWScan').getAttribute("height"));
        //
        // document.getElementById('GWScan').style.marginLeft = "0px";
        // document.getElementById('GWScan').style.marginTop = "0px";
        // //document.getElementById('xxx').value = window.innerHeight;
        // resizeTimer = null;
      };

      window.onresize = function () {
        //if (resizeTimer == null) {
        //	resizeTimer = setTimeout(doResize, 300);
        //}
        // doResize();
      };

      this.unload = function () {
        if (document.getElementById("GWScan") != null)
          if (document.getElementById("GWScan").object != null) {
            //alert('窗口关闭');
            console.log('GWScan:', '窗口关闭');
            GWScan.Close();
            //GWScan = null;
            //document.getElementById("divscan").innerHTML = "<object id='GWScan' width='40px' height='40px'><br><br><br><br><center>未安装高拍仪</center></object>";
            CollectGarbage();
            setTimeout(CollectGarbage, 1);
          }
      };

      
      /**
       * 离开页面关闭active
       */
      window.onunload = function () {
        this.unload();
      }.bind(this);


      this.collection = function () {
        return GWScan.Scan('1');
      };

      this.changeWorkSpace = function () {
        GWScan.SetWorkFolder('');
      };

      this.delSelected = function () {
        GWScan.DeleteSelected();
      };

      this.isShowSideBar = function () {
        GWScan.ShowTree();
      };

      this.SetWorkingPath = function (isInit) {
        //        var storage = window.localStorage;
        //        alert("选择临时文件工作文件夹. ");
        //        storage.setItem("GWScanWorkFolder", GWScan.SetWorkFolder(""));
        //        alert("设置影像来源. ");
        //        storage.setItem("GWScanDataSource", GWScan.DataSourceManager());
        //        GWScan.SetDataSource(storage.getItem("GWScanDataSource"));
        //         var storage = window.localStorage;
        //         if (!angular.isUndefined(isInit)) {
        //           if (!storage.getItem("GWScanWorkFolder")) {
        //             alert("选择临时文件工作文件夹. ");
        //             storage.setItem("GWScanWorkFolder", GWScan.SetWorkFolder(""));
        //           } else {
        //             GWScan.SetWorkFolder(storage.getItem("GWScanWorkFolder"));
        //           }
        //         } else {
        //           storage.setItem("GWScanWorkFolder", GWScan.SetWorkFolder(""));
        //         }
        GWScan.SetWorkFolder(isInit);
      };

      //TODO
      this.SetDataSource = function (isInit) {
        // var storage = window.localStorage;
        // if (!angular.isUndefined(isInit)) {
        //   if (!storage.getItem("GWScanDataSource")) {
        //     alert("设置影像源. ");
        //     storage.setItem("GWScanDataSource", GWScan.DataSourceManager());
        //   } else {
        //     GWScan.SetDataSource(storage.getItem("GWScanDataSource"));
        //   }
        // } else {
        //   storage.setItem("GWScanDataSource", GWScan.DataSourceManager());
        // }
        // GWScan.SetDataSource(isInit);
        GWScan.DataSourceManager();
        defer.resolve();
      };


      this.SwitchCamera = function (isInit) {
        var type = this.getSettingOption();
        var dataSource = type.DataSource;
        var source = dataSource.substring(0, 1);
        if (source == '1') {
          GWScan.SetDataSource('1|' + isInit + '|0');
        }
        defer.resolve();
      };


      /**
       * 获取初始化时的设备类型
       */
      this.getInitDataSource = function () {
        return defer.promise;
      };


      // this.upload = function (fileStr) {
      //   var uploadDefer = $q.defer();

      //   // switch (AMUConfig.upload.type) {
      //   //   case 'ext':
      //   //     uploadDefer.resolve(JSON.parse(NDCMSInterface.UploadBlob(fileStr)));
      //   //     break;
      //   //   case 'web':
      //   console.log('将要上传的文件路径：', fileStr);

      //   var fileArray = fileStr.split(',');

      //   //将base64转换为Blob
      //   function dataURItoBlob(byteString, mimeString) {
      //     byteString = atob(byteString);
      //     // write the bytes of the string to a typed array
      //     var ia = new Uint8Array(byteString.length);
      //     for (var i = 0; i < byteString.length; i++) {
      //       ia[i] = byteString.charCodeAt(i);
      //     }
      //     return new Blob([ia], {
      //       type: mimeString
      //     });
      //   }

      //   //初始化formData对象
      //   var fd = new FormData();
      //   //上传处理
      //   angular.forEach(fileArray, function (filePath, index) {
      //     var fileData = JSON.parse(this.fileToBase64(filePath));
      //     var BlobObj = dataURItoBlob(fileData.base64, fileData.mimeType);
      //     fd.append('file' + index, BlobObj, fileData.path);
      //   }.bind(this));

      //   $http.post(AMUConfig.upload.url, fd, {
      //       headers: {
      //         'Content-Type': undefined
      //       } //,
      //     })
      //     .success(function (data) {
      //       $log.debug('uploaded ok..', data);
      //       uploadDefer.resolve(data);
      //     })
      //     .error(function () {
      //       $log.debug('uploaded error...');
      //       uploadDefer.reject();
      //     });
      //   //     break;
      //   // }
      //   return uploadDefer.promise;
      // };

      this.download = function () {
        var now = new Date();
        var rtn = NDCMSInterface.DownloadBlob(blobId, "D:\\皮卡丘_d_" + now.format("yyyyMMddhhmmssf") + ".jpg");
        alert(rtn);
      };

      this.remove = function (blobId) {
        var rtn = NDCMSInterface.RemoveBlob(blobId);
        alert(rtn);
      };

      this.openfolder = function () {
        var rtn = NDCMSInterface.OpenForder("");
        alert(rtn);
      };

      this.openfile = function (isMulti) {
        return NDCMSInterface.OpenFile("", "", isMulti);
        // alert(rtn);
      };

      this.opentxtfile = function () {
        var rtn = NDCMSInterface.OpenFile("", "文本文件|*.txt;*.xml|所有文件 (*.*)|*.*", false);
        alert(rtn);
      };

      this.fileToBase64 = function (fileUrl) {
        return NDCMSInterface.FileToBase64(fileUrl);
      };

      this.thumbnailToBase64 = function (fileUrl) {
        return NDCMSInterface.ThumbnailToBase64(fileUrl, 150, 150);
      };


      this.SetRotation = function (param) {
        var rotationT;
        if (param == "0") {
          rotationT = "0";
        } else {
          rotationT = "90";
        }
        var storage = window.localStorage;
        // var GWScanSetRotation = "" + param;
        GWScan.SetRotation(rotationT);
        // storage.setItem("GWScanSetRotation", GWScanSetRotation);
        console.log('SetRotation:', param);
      };

      this.SetAutoCutEgde = function (param) {
        // var storage = window.localStorage;
        var GWScanSetAutoCutEgde = "" + param;
        GWScan.SetAutoCutEgde(GWScanSetAutoCutEgde);
        // storage.setItem("GWScanSetAutoCutEgde", GWScanSetAutoCutEgde);
        console.log('SetAutoCutEgde:', param);
      };

      this.SetAutoDenoise = function (param) {
        // var storage = window.localStorage;
        var GWScanSetAutoDenoise = "" + param;
        GWScan.SetAutoDenoise(GWScanSetAutoDenoise);
        // storage.setItem("GWScanSetAutoDenoise", GWScanSetAutoDenoise);
        console.log('SetAutoDenoise:', param);
      };

      this.SetAutoRectification = function (param) {
        console.log('SetAutoRectification:', param);
      };

      return this;
    }
  ]);