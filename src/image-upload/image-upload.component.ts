import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {ImageService, Header} from "../image.service";

class FileHolder {

    constructor(private src: string, public file: File) {
    }
}

@Component({
    selector: 'og-uploader',
    template: `<head>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
            </head>
            <button> (click)="show()" class={{styling}}>{{buttonCaption}}</button>
                <div class="modal fade" tabindex="-1" [ngClass]="{'in': visibleAnimate}"
                   [ngStyle]="{'display': visible ? 'block' : 'none', 'opacity': visibleAnimate ? 1 : 0}">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <div class="app-modal-header">
                                    <h3>Outgrow Uploader</h3>
                                </div>
                            </div>
                            <div class="modal-body ">
                                <div class="app-modal-body ">
                                    <div class="image-upload"
                                        fileDrop
                                        [accept]=acceptTypes
                                        (isFileOver)="fileOver($event)"
                                        (fileDrop)="fileChange($event)"
                                        [ngClass]="{'file-is-over': isFileOver}"
                                    >
                                        <div class="file-upload hr-inline-group">
                                            <label class="upload-button">
                                                <span>{{uploadButtonCaption}}</span>
                                                <input
                                                    type="file"
                                                    accept={{acceptTypes}}
                                                    (change)="fileChange(input.files)"
                                                    #input
                                                >
                                            </label>
                                            <div class="drag-box-message">{{dropBoxMessage}}</div>
                                        </div>
            
                                        <div *ngIf="isPending" style="margin: auto" class="image-container hr-inline-group">
                                            <div
                                            class="image"
                                            [ngStyle]="{'background-image': 'url('+rotatingGif+')'}"
                                            >
                                            
                                            </div>
                                        </div>
                                    </div><br>
                                    <div class="image-upload" style="height:60px;">
                                        <div class="row" style="margin-top:1%">
                                            <div class="col-sm-3 upload">
                                                <label>Upload from link</label>
                                            </div>
                                            <div class="col-sm-6">
                                                <span><input type="url" class="form-control" #url></span>
                                            </div>
                                            <div class="col-sm-3">
                                                <input type="button" value="Submit" class="btn-danger form-control" (click)="send(url.value)">
                                            </div>
                                        </div>
                                    </div>
                                    <div style="text-align: center justify; font-size: 18px; color: red " *ngIf=errMsgShow>{{errMsg}}<div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <div class="app-modal-footer">
                                    <button type="button" class="btn btn-default" (click)="hide()">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
    styleUrls: [`.modal-dialog {
  padding-top:8%;
  width: 60% !important;
}

.modal-content {
  height: 100% !important;
  overflow:visible;
}

.modal-body {
  height: 100%;
  overflow: auto;
  background-color: lightslategray;
}

.modal-footer {
    padding: 15px;
    text-align: right;
    border-top: 1px solid lightslategray;
}

.image-upload {
  --active-color: #30bf5a;
  position: relative;
  border-radius: 5px;
  border: #d0d0d0 2px;
  font-family: sans-serif;
}

.file-is-over {
  border: var(--active-color) solid 2px;
}

.hr-inline-group:after {
  display: table;
  clear: both;
  content: "";
}

.file-upload {
  padding: 15px;
  background-color: #f3f3f3;
}

.drag-box-message {
  display: inline-block;
  margin-left: 10px;
  padding-top: 8px;
  color: #9b9b9b;
  font-weight: 600;
}

label.upload-button input[type=file]{
  display: none;
  position: fixed;
  top: -99999px;
}

.upload-button {
  cursor: pointer;
  background-color: var(--active-color);
  padding: 5px 10px 5px 10px;
  border-radius: 5px;
  color: white;
  font-size: 1.25em;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
}


.image-container {
  background-color: #f8f8f8;
  border-radius: 0 0 5px 5px;
}

.image {
  
  display: inline-block;
  margin: 5px;
  width: 86px;
  height: 86px;
  background: center center no-repeat;
  background-size: contain;
  position: relative;
}

.upload{
  text-align: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: #f5fffa;
  font-size: 15px;
}
`]
})
export class ImageUploadComponent {
    public visible: boolean = false;
    private visibleAnimate = false;
    url: string = "http://97ed60c2.ngrok.io";
    headers: Header[];
    private errMsg: string;
    private errMsgShow: boolean;
    private files: FileHolder;
    private loadingImg: string="https://oguploader.s3.amazonaws.com/hqH173fyuvJeCzeautbufB0T.gif";
    private finishImg: string="https://oguploader.s3.amazonaws.com/uRpawC5i34U74PEXA2Hnuz2b.png";
    private rotatingGif: string;
    private pendingFilesCounter: number = 0;
    private isFileOver: boolean = false;
    private isPending: boolean;
    private uploadButtonCaption: string = "Select File";
    private dropBoxMessage: string = "Drop your file here!";
    @Input()
    private buttonCaption: string = "Upload";
    @Input() acceptTypes: string[];
    @Input() styling: string;
    @Input() quality: string = '65';
    @ViewChild('url') urlField;
    @Output()
    private onFileUploadFinish: EventEmitter<FileHolder> = new EventEmitter<FileHolder>();

    constructor(private imageService: ImageService) {
    }

    ngOnInit() {
        this.isPending = false;
        this.imageService.setUrl(this.url);
        this.imageService.setQuality(this.quality);
    }

    fileChange(files) {
        this.errMsgShow = false;
        this.isPending = true;
        this.rotatingGif = this.loadingImg;
        let reader = new FileReader();
        reader.addEventListener('load', (event: any) => {
            let fileHolder: FileHolder = new FileHolder(event.target.result, files[0]);
            this.uploadFile(fileHolder);
            this.files = fileHolder;
        }, false);
        reader.readAsDataURL(files[0]);
    }

    private uploadFile(fileHolder: FileHolder) {
        if (this.url) {
            this.imageService.postImage(fileHolder.file, this.headers).subscribe(response => {
                this.onFileUploadFinish.emit(response.InkBlob);
                this.rotatingGif = this.finishImg;
                setTimeout(() => this.hide(), 1500);
            }, err => {
                this.errMsg = err.err;
                this.errMsgShow = true;
            });

        } else {
            this.onFileUploadFinish.emit(fileHolder);
        }
    }

    fileOver(isOver) {
        this.isFileOver = isOver;
    }

    public show(): void {
        this.visible = true;
        setTimeout(() => this.visibleAnimate = true);
    }

    public hide(): void {
        this.visibleAnimate = false;
        setTimeout(() => this.visible = false, 300);
        this.files = null;
        this.isPending = false;
        this.urlField.nativeElement.value = "";
    }

    send(val: string) {
        this.errMsgShow = false;
        this.isPending = true;
        this.rotatingGif = this.loadingImg;
        this.imageService.linkupload(val, this.headers).subscribe(res => {
            this.onFileUploadFinish.emit(res.InkBlob);
            this.rotatingGif = this.finishImg;
            setTimeout(() => this.hide(), 1500);
        }, err => {
            this.errMsg = err.err;
            this.errMsgShow = true;
        });
    }
}
