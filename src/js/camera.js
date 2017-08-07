var promisifiedOldGUM = function(constraints) {

    // 第一个拿到getUserMedia，如果存在
    var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);

    // 有些浏览器只是不实现它-返回一个不被拒绝的承诺与一个错误保持一致的接口
    if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser-getUserMedia是不是在这个浏览器实现'));
    }

    // 否则，调用包在一个旧navigator.getusermedia承诺
    return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
    });

}

// 旧的浏览器可能无法实现mediadevices可言，所以我们设置一个空的对象第一
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
}

// 一些浏览器部分实现mediadevices。我们不能只指定一个对象
// 随着它将覆盖现有的性能getUserMedia。.
// 在这里，我们就要错过添加getUserMedia财产。.     
if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
}

// Prefer camera resolution nearest to 1280x720.
var constraints = {
    audio: true,
    video: {
        width: 1280,
        height: 720
    }
};

navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    var video = document.querySelector('video');
    video.src = window.URL.createObjectURL(stream);
    video.onloadedmetadata = function(e) {
        video.play();
    };
}).catch(function(err) {
    console.log(err.name + ": " + err.message);
});