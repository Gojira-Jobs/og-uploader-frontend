import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {ImageService, Header} from "../image.service";
declare var $;
class FileHolder {
  constructor(private src: string, public file: File) { }
}

@Component({
  selector: 'og-uploader',
  templateUrl:'./image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {
  public visible:boolean=false;
  private visibleAnimate = false;
  url: string="http://97ed60c2.ngrok.io";
  headers: Header[];  
  private errMsg: string;
  private errMsgShow: boolean;
  private files: FileHolder;
  private loadingImg: string="../../../assets/transfer.gif";
  private finishImg: string="../../../assets/double.png";
  private rotatingGif: string;
  private pendingFilesCounter: number = 0;
  private isFileOver:boolean = false;
  private isPending: boolean;
  private uploadButtonCaption: string = "Select File";
  private dropBoxMessage: string = "Drop your file here!";
  @Input()
  private buttonCaption: string = "Upload";
  @Input() acceptTypes : string[];
  @Input() styling: string;
  @Input() quality: string='65';
  @ViewChild('url') urlField;
  @Output()
  private onFileUploadFinish: EventEmitter<FileHolder> = new EventEmitter<FileHolder>();
  
  constructor(private imageService: ImageService) { }

  ngOnInit() {
    this.isPending=false;
    this.imageService.setUrl(this.url);
    this.imageService.setQuality(this.quality);
  }

  fileChange(files) {
    this.errMsgShow=false;
    this.isPending=true;
    this.rotatingGif=this.loadingImg;
    let reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        let fileHolder: FileHolder = new FileHolder(event.target.result, files[0]);
        this.uploadFile(fileHolder);
        this.files=fileHolder;
      }, false);
      reader.readAsDataURL(files[0]);
  }

  private uploadFile(fileHolder: FileHolder) {
    if (this.url) {
      this.imageService.postImage(fileHolder.file, this.headers).subscribe(response => {
        this.onFileUploadFinish.emit(response.InkBlob);
        this.rotatingGif=this.finishImg;
        setTimeout(() => this.hide(), 1500);
      },err=>{
      this.errMsg=err.err;
      this.errMsgShow=true;
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
    this.files=null;
    this.isPending=false;
    this.urlField.nativeElement.value="";
  }
  
  send(val:string){
    this.errMsgShow=false;
    this.isPending=true;
    this.rotatingGif=this.loadingImg;
    this.imageService.linkupload(val,this.headers).subscribe(res=>
    {
      this.onFileUploadFinish.emit(res.InkBlob);
      this.rotatingGif=this.finishImg;
      setTimeout(() => this.hide(), 1500);
    },err=>{
      this.errMsg=err.err;
      this.errMsgShow=true;
    });
  }
}
