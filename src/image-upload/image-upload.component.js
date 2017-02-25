"use strict";
var core_1 = require('@angular/core');
var image_service_1 = require("../image.service");
var FileHolder = (function () {
    function FileHolder(src, file) {
        this.src = src;
        this.file = file;
        this.pending = false;
    }
    return FileHolder;
}());
var ImageUploadComponent = (function () {
    function ImageUploadComponent(imageService) {
        this.imageService = imageService;
        this.visible = false;
        this.visibleAnimate = false;
        this.max = 1;
        this.url = "http://bc0deff6.ngrok.io";
        this.preview = true;
        this.styling = 'btn btn-primary';
        this.quality = '65';
        this.isPending = new core_1.EventEmitter();
        this.onFileUploadFinish = new core_1.EventEmitter();
        this.onRemove = new core_1.EventEmitter();
        this.files = [];
        this.fileCounter = 0;
        this.pendingFilesCounter = 0;
        this.isFileOver = false;
        this.buttonCaption = "Select Images";
        this.uploadButtonCaption = "Select Images";
        this.dropBoxMessage = "Drop your images here!";
    }
    ImageUploadComponent.prototype.ngOnInit = function () {
        if (this.max == 1) {
            this.input.nativeElement.multiple = false;
        }
        this.imageService.setUrl(this.url);
        this.imageService.setQuality(this.quality);
    };
    ImageUploadComponent.prototype.fileChange = function (files) {
        this.errMsgShow = false;
        var remainingSlots = this.countRemainingSlots();
        var filesToUploadNum = files.length > remainingSlots ? remainingSlots : files.length;
        if (this.url && filesToUploadNum != 0) {
            this.isPending.emit(true);
        }
        this.fileCounter += filesToUploadNum;
        this.uploadFiles(files, filesToUploadNum);
    };
    ImageUploadComponent.prototype.uploadFiles = function (files, filesToUploadNum) {
        var _this = this;
        var _loop_1 = function(i) {
            var file = files[i];
            // let img = document.createElement('img');
            // img.src = window.URL.createObjectURL(file);
            var reader = new FileReader();
            reader.addEventListener('load', function (event) {
                var fileHolder = new FileHolder(event.target.result, file);
                fileHolder.serverResponse = "good boy: " + i;
                _this.uploadSingleFile(fileHolder);
                _this.files.push(fileHolder);
            }, false);
            reader.readAsDataURL(file);
        };
        for (var i = 0; i < filesToUploadNum; i++) {
            _loop_1(i);
        }
    };
    ImageUploadComponent.prototype.uploadSingleFile = function (fileHolder) {
        var _this = this;
        if (this.url) {
            this.pendingFilesCounter++;
            fileHolder.pending = true;
            this.imageService.postImage(fileHolder.file, this.headers).subscribe(function (response) {
                fileHolder.serverResponse = response;
                _this.onFileUploadFinish.emit(response.InkBlob);
                fileHolder.pending = false;
                if (--_this.pendingFilesCounter == 0) {
                    _this.isPending.emit(false);
                }
            }, function (err) {
                _this.errMsg = err.err;
                _this.errMsgShow = true;
            });
        }
        else {
            this.onFileUploadFinish.emit(fileHolder);
        }
    };
    ImageUploadComponent.prototype.deleteFile = function (file) {
        var index = this.files.indexOf(file);
        this.files.splice(index, 1);
        this.fileCounter--;
        this.onRemove.emit(file);
    };
    ImageUploadComponent.prototype.fileOver = function (isOver) {
        this.isFileOver = isOver;
    };
    ImageUploadComponent.prototype.countRemainingSlots = function () {
        return this.max - this.fileCounter;
    };
    Object.defineProperty(ImageUploadComponent.prototype, "value", {
        get: function () {
            return this.files;
        },
        enumerable: true,
        configurable: true
    });
    ImageUploadComponent.prototype.modal = function () {
        this.show();
    };
    ImageUploadComponent.prototype.show = function () {
        var _this = this;
        this.visible = true;
        setTimeout(function () { return _this.visibleAnimate = true; });
    };
    ImageUploadComponent.prototype.hide = function () {
        var _this = this;
        this.visibleAnimate = false;
        setTimeout(function () { return _this.visible = false; }, 300);
        this.files = [];
        this.fileCounter = 0;
        this.pendingFilesCounter = 0;
    };
    ImageUploadComponent.prototype.send = function (val) {
        var _this = this;
        this.errMsgShow = false;
        this.imageService.linkupload(val, this.headers).subscribe(function (res) {
            _this.onFileUploadFinish.emit(res.InkBlob);
        }, function (err) {
            _this.errMsg = err.err;
            _this.errMsgShow = true;
        });
    };
    ImageUploadComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'og-uploader',
                    template: "<head>\n<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\">\n</head>\n<button (click)=\"modal()\" class={{styling}}>{{buttonCaption}}</button>\n\t<div class=\"modal fade\" tabindex=\"-1\" [ngClass]=\"{'in': visibleAnimate}\"\n       [ngStyle]=\"{'display': visible ? 'block' : 'none', 'opacity': visibleAnimate ? 1 : 0}\">\n\t\t<div class=\"modal-dialog\">\n\t\t\t<div class=\"modal-content\">\n\t\t\t\t<div class=\"modal-header\">\n\t\t\t\t\t<div class=\"app-modal-header\">\n           \t\t\t\t<h3>Outgrow Uploader</h3>\n          \t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"modal-body \">\n           \t\t\t<div class=\"app-modal-body \">\n\t\t\t\t\t\t<div class=\"image-upload\"\n\t\t\t\t\t\t\tfileDrop\n\t\t\t\t\t\t\t[accept]=acceptTypes\n\t\t\t\t\t\t\t(isFileOver)=\"fileOver($event)\"\n\t\t\t\t\t\t\t(fileDrop)=\"fileChange($event)\"\n\t\t\t\t\t\t\t[ngClass]=\"{'file-is-over': isFileOver}\"\n\t\t\t\t\t\t>\n  \t\t\t\t\t\t\t<div class=\"file-upload hr-inline-group\">\n\t\t\t\t\t\t\t\t<label class=\"upload-button\">\n      \t\t\t\t\t\t\t\t<span>{{uploadButtonCaption}}</span>\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype=\"file\"\n\t\t\t\t\t\t\t\t\t\taccept={{acceptTypes}}\n\t\t\t\t\t\t\t\t\t\tmultiple (change)=\"fileChange(input.files)\"\n\t\t\t\t\t\t\t\t\t\t#input>\n    \t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t<div class=\"drag-box-message\">{{dropBoxMessage}}</div>\n\t\t\t\t\t\t\t</div>\n\n  \t\t\t\t\t\t\t<div *ngIf=\"preview\" class=\"image-container hr-inline-group\">\n\t\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\tclass=\"image\"\n\t\t\t\t\t\t\t\t*ngFor=\"let file of files\"\n\t\t\t\t\t\t\t\t[ngStyle]=\"{'background-image': 'url('+ file.src +')'}\"\n\t\t\t\t\t\t\t\t>\n      \t\t\t\t\t\t\t\t<div *ngIf=\"file.pending\" class=\"loading-overlay\">\n        \t\t\t\t\t\t\t\t<div class=\"spinningCircle\"></div>\n      \t\t\t\t\t\t\t\t</div>\n      \t\t\t\t\t\t\t\t<div *ngIf=\"!file.pending\" class=\"x-mark\" (click)=\"deleteFile(file)\">\n        \t\t\t\t\t\t\t\t<span class=\"close\"></span>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div><br>\n\t\t\t\t\t\t<div class=\"image-upload\" style=\"height:60px;\">\n\t\t\t\t\t\t\t<div class=\"row\" style=\"margin-top:1%\">\n\t\t\t\t\t\t\t\t<div class=\"col-sm-3\" style=\"text-align:center;\">\n\t\t\t\t\t\t\t\t\t<label style=\"font-size:20px;\">Upload from link</label>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t\t\t\t<span><input type=\"url\" class=\"form-control\" #url></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-sm-3\">\n\t\t\t\t\t\t\t\t\t<input type=\"button\" value=\"Submit\" class=\"btn-danger form-control\" (click)=\"send(url.value)\">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div style=\"text-align: center justify; font-size: 18px; color: red \" *ngIf=errMsgShow>{{errMsg}}<div>\n                    </div>\n        \t\t</div>\n        \t\t<div class=\"modal-footer\">\n          \t\t\t<div class=\"app-modal-footer\">\n      \t\t\t\t\t<button type=\"button\" class=\"btn btn-default\" (click)=\"hide()\">Close</button>\n\t\t\t\t\t</div>\n        \t\t</div>\n      \t\t</div>\n    \t</div>\n\t</div>",
                    styles: [".modal-dialog {\n  padding-top:8%;\n  width: 60% !important;\n}\n\n.modal-content {\n  height: 100% !important;\n  overflow:visible;\n}\n\n.modal-body {\n  height: 100%;\n  overflow: auto;\n  background-color: lightslategray;\n}\n\n.image-upload {\n  --active-color: #30bf5a;\n  position: relative;\n  border-radius: 5px;\n  border: #d0d0d0 dotted 2px;\n  font-family: sans-serif;\n}\n\n.file-is-over {\n  border: var(--active-color) solid 2px;\n}\n\n.hr-inline-group:after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.file-upload {\n  padding: 15px;\n  background-color: #f3f3f3;\n}\n\n.drag-box-message {\n  display: inline-block;\n  margin-left: 10px;\n  padding-top: 8px;\n  color: #9b9b9b;\n  font-weight: 600;\n}\n\nlabel.upload-button input[type=file]{\n  display: none;\n  position: fixed;\n  top: -99999px;\n}\n\n.upload-button {\n  cursor: pointer;\n  background-color: var(--active-color);\n  padding: 5px 10px 5px 10px;\n  border-radius: 5px;\n  color: white;\n  font-size: 1.25em;\n  font-weight: 600;\n  text-transform: uppercase;\n  display: inline-block;\n}\n\n\n.image-container {\n  background-color: #f8f8f8;\n  border-radius: 0 0 5px 5px;\n}\n\n.image {\n  \n  display: inline-block;\n  margin: 5px;\n  width: 86px;\n  height: 86px;\n  background: center center no-repeat;\n  background-size: contain;\n  position: relative;\n}\n\n.x-mark {\n  width: 20px;\n  height: 20px;\n  text-align: center;\n  cursor: pointer;\n  border-radius: 2px;\n  float: right;\n  background-color: black;\n  opacity: .7;\n  color: white;\n  margin: 2px;\n}\n\n.close {\n  width: 20px;\n  height: 20px;\n  opacity: .7;\n  position: relative;\n  padding-right: 3px;\n}\n.x-mark:hover .close {\n  opacity: 1;\n}\n.close:before, .close:after {\n  border-radius: 2px;\n  position: absolute;\n  content: '';\n  height: 16px;\n  width: 3px;\n  top: 2px;\n  background-color: #FFFFFF;\n}\n\n.close:before {\n  transform: rotate(45deg);\n}\n\n.close:after {\n  transform: rotate(-45deg);\n}\n\n.loading-overlay {\n  position: absolute;\n  top: 0; left: 0; bottom: 0; right: 0;\n  background-color: black;\n  opacity: .7;\n}\n\n.spinningCircle {\n  height: 30px;\n  width: 30px;\n  margin: auto;\n  position: absolute;\n  top: 0; left: 0; bottom: 0; right: 0;\n  border-radius: 50%;\n  border: 3px solid rgba(255, 255, 255, 0);\n  border-top: 3px solid white;\n  border-right: 3px solid white;\n  -webkit-animation: spinner 2s infinite cubic-bezier(0.085, 0.625, 0.855, 0.360);\n  animation: spinner 2s infinite cubic-bezier(0.085, 0.625, 0.855, 0.360);\n}\n\n@-webkit-keyframes spinner {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes spinner {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n\n  }\n}\n"]
                },] },
    ];
    /** @nocollapse */
    ImageUploadComponent.ctorParameters = function () { return [
        { type: image_service_1.ImageService, },
    ]; };
    ImageUploadComponent.propDecorators = {
        'max': [{ type: core_1.Input },],
        'headers': [{ type: core_1.Input },],
        'preview': [{ type: core_1.Input },],
        'acceptTypes': [{ type: core_1.Input },],
        'styling': [{ type: core_1.Input },],
        'quality': [{ type: core_1.Input },],
        'input': [{ type: core_1.ViewChild, args: ['input',] },],
        'isPending': [{ type: core_1.Output },],
        'onFileUploadFinish': [{ type: core_1.Output },],
        'onRemove': [{ type: core_1.Output },],
        'buttonCaption': [{ type: core_1.Input },],
        'uploadButtonCaption': [{ type: core_1.Input },],
        'dropBoxMessage': [{ type: core_1.Input },],
    };
    return ImageUploadComponent;
}());
exports.ImageUploadComponent = ImageUploadComponent;
//# sourceMappingURL=image-upload.component.js.map