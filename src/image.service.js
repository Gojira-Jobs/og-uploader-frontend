"use strict";
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require('rxjs/Rx');
var ImageService = (function () {
    function ImageService(http) {
        this.http = http;
    }
    ImageService.prototype.setUrl = function (url) {
        this.url = url;
    };
    ImageService.prototype.setQuality = function (quality) {
        this.quality = quality;
    };
    ImageService.prototype.postImage = function (image, headers) {
        this.checkUrl();
        var formData = new FormData();
        formData.append('image', image);
        formData.append('quality', this.quality);
        console.log("file from service");
        console.log(image);
        return this.http.post(this.url, formData, headers)
            .map(function (res) {
            console.log(res.json());
            return res.json();
        });
    };
    ImageService.prototype.linkupload = function (url, headers) {
        var formData = new FormData();
        formData.append('link', url);
        formData.append('quality', this.quality);
        console.log("link");
        console.log(formData);
        return this.http.post(this.url, formData, headers)
            .map(function (res) {
            console.log(res.json());
            return res.json();
        });
    };
    ImageService.prototype.checkUrl = function () {
        if (!this.url) {
            throw new Error('Url is not set! Please use setUrl(url) method before doing queries');
        }
    };
    ImageService.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    ImageService.ctorParameters = function () { return [
        { type: http_1.Http, },
    ]; };
    return ImageService;
}());
exports.ImageService = ImageService;
//# sourceMappingURL=image.service.js.map