import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {ImageService, Header} from "../image.service";
declare var $;


export class FileHolder {
    public serverResponse: any;
    public pending: boolean = false;

    constructor(private src: string, public file: File) {
    }
}

@Component({
    selector: 'og-uploader',
    template: `<head>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
</head>
<button (click)="modal()" class={{styling}}>click to upload</button>
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
      								<span>{{buttonCaption}}</span>
									<input
										type="file"
										accept={{acceptTypes}}
										multiple (change)="fileChange(input.files)"
										#input>
    							</label>
								<div class="drag-box-message">{{dropBoxMessage}}</div>
							</div>

  							<div *ngIf="preview" class="image-container hr-inline-group">
								<div
								class="image"
								*ngFor="let file of files"
								[ngStyle]="{'background-image': 'url('+ file.src +')'}"
								>
      								<div *ngIf="file.pending" class="loading-overlay">
        								<div class="spinningCircle"></div>
      								</div>
      								<div *ngIf="!file.pending" class="x-mark" (click)="deleteFile(file)">
        								<span class="close"></span>
									</div>
								</div>
							</div>
						</div><br>
						<div class="image-upload" style="height:60px;">
							<div class="row" style="margin-top:1%">
								<div class="col-sm-3" style="text-align:center;">
									<label style="font-size:20px;">Upload from link</label>
								</div>
								<div class="col-sm-6">
									<span><input type="url" class="form-control" #url></span>
								</div>
								<div class="col-sm-3">
									<input type="button" value="Submit" class="btn-danger form-control" (click)="send(url.value)">
								</div>
							</div>
						</div>
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
    styles: [`.modal-dialog {
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

.image-upload {
  --active-color: #30bf5a;
  position: relative;
  border-radius: 5px;
  border: #d0d0d0 dotted 2px;
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

.x-mark {
  width: 20px;
  height: 20px;
  text-align: center;
  cursor: pointer;
  border-radius: 2px;
  float: right;
  background-color: black;
  opacity: .7;
  color: white;
  margin: 2px;
}

.close {
  width: 20px;
  height: 20px;
  opacity: .7;
  position: relative;
  padding-right: 3px;
}
.x-mark:hover .close {
  opacity: 1;
}
.close:before, .close:after {
  border-radius: 2px;
  position: absolute;
  content: '';
  height: 16px;
  width: 3px;
  top: 2px;
  background-color: #FFFFFF;
}

.close:before {
  transform: rotate(45deg);
}

.close:after {
  transform: rotate(-45deg);
}

.loading-overlay {
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  background-color: black;
  opacity: .7;
}

.spinningCircle {
  height: 30px;
  width: 30px;
  margin: auto;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0);
  border-top: 3px solid white;
  border-right: 3px solid white;
  -webkit-animation: spinner 2s infinite cubic-bezier(0.085, 0.625, 0.855, 0.360);
  animation: spinner 2s infinite cubic-bezier(0.085, 0.625, 0.855, 0.360);
}

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);

  }
}
`]
})
export class ImageUploadComponent {
    public visible: boolean = false;
    visibleAnimate = false;
    @Input() max: number = 1;
    @Input() url: string;
    @Input() headers: Header[];
    @Input() preview: boolean = true;
    @Input() acceptTypes: string[];
    @Input() styling: string = 'btn btn-primary';
    @ViewChild('input') input;
    @Output()
    isPending: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output()
    onFileUploadFinish: EventEmitter<FileHolder> = new EventEmitter<FileHolder>();
    @Output()
    onRemove: EventEmitter<FileHolder> = new EventEmitter<FileHolder>();

    private files: FileHolder[] = [];

    private fileCounter: number = 0;
    private pendingFilesCounter: number = 0;

    isFileOver: boolean = false;

    @Input()
    buttonCaption: string = "Select Images";
    @Input()
    dropBoxMessage: string = "Drop your images here!";

    constructor(private imageService: ImageService) {
    }

    ngOnInit() {
        if (this.max == 1) {
            this.input.nativeElement.multiple = false;
        }
        this.imageService.setUrl(this.url);
    }

    fileChange(files) {
        let remainingSlots = this.countRemainingSlots();
        let filesToUploadNum = files.length > remainingSlots ? remainingSlots : files.length;

        if (this.url && filesToUploadNum != 0) {
            this.isPending.emit(true);
        }

        this.fileCounter += filesToUploadNum;

        this.uploadFiles(files, filesToUploadNum);
    }

    uploadFiles(files, filesToUploadNum) {
        for (let i = 0; i < filesToUploadNum; i++) {
            let file = files[i];


            let img = document.createElement('img');
            img.src = window.URL.createObjectURL(file);

            let reader = new FileReader();
            reader.addEventListener('load', (event: any) => {
                let fileHolder: FileHolder = new FileHolder(event.target.result, file);

                fileHolder.serverResponse = `good boy: ${i}`;

                this.uploadSingleFile(fileHolder);

                this.files.push(fileHolder);

            }, false);


            reader.readAsDataURL(file);
        }
    }

    uploadSingleFile(fileHolder: FileHolder) {
        if (this.url) {
            this.pendingFilesCounter++;
            fileHolder.pending = true;

            this.imageService.postImage(fileHolder.file, this.headers).subscribe(response => {
                fileHolder.serverResponse = response;
                this.onFileUploadFinish.emit(response.data);
                fileHolder.pending = false;
                if (--this.pendingFilesCounter == 0) {
                    this.isPending.emit(false);
                }
            });

        } else {
            this.onFileUploadFinish.emit(fileHolder);
        }
    }

    private deleteFile(file: FileHolder): void {
        let index = this.files.indexOf(file);
        this.files.splice(index, 1);
        this.fileCounter--;
        this.onRemove.emit(file);
    }

    fileOver(isOver) {
        this.isFileOver = isOver;
    }

    private countRemainingSlots() {
        return this.max - this.fileCounter;
    }


    get value(): any[] {
        return this.files;
    }

    modal() {
        this.show();

    }

    public show(): void {
        this.visible = true;
        setTimeout(() => this.visibleAnimate = true);
    }

    public hide(): void {
        this.visibleAnimate = false;
        setTimeout(() => this.visible = false, 300);
        this.files = [];
        this.fileCounter = 0;
        this.pendingFilesCounter = 0;
    }

    send(val: string) {
        this.imageService.linkupload(val).subscribe(res => {
            this.onFileUploadFinish.emit(res.data);
        });
    }
}
