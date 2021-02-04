//反向代理服务器
//同时联接两个后台服务器，以便于调试angularJs应用
var http = require('http'), httpProxy = require('http-proxy');
//
// Create your proxy server and set the target in the options.
//
var proxy_front = httpProxy.createProxyServer({});
var proxy_end = httpProxy.createProxyServer({});
// 捕获异常
proxy_front.on('error', function (err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Front Server:Something went wrong' + err);
});

proxy_end.on('error', function (err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('App Server:Something went wrong' + err);
});

// 另外新建一个 HTTP 80 端口的服务器，也就是常规 Node 创建 HTTP 服务器的方法。
// 在每次请求中，调用 proxy.web(req, res config) 方法进行请求分发
var server = require('http').createServer(function (req, res) {
    var url = req.url;

    // 如果是后台Rest请求
    if ('/api' === url.slice(0, 4) || '/uaa' === url.slice(0, 4)) {
        // 代理到后台开发服务器
        console.log('[api]', url);
        proxy_end.web(req, res, {
            target: 'http://localhost:8080'
        });
        return;
    }
    // 代理到前台开发服务器
    console.log('[ui]', url);
    proxy_front.web(req, res, {
        target: 'http://localhost:9000'
    });
});
console.log("server start up on port 80");
console.log("Sipub url= http://localhost:8000/#/login");
server.listen(8090);
