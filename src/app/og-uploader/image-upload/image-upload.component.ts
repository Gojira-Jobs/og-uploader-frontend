import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {ImageService, Header} from "../image.service";
declare var $;
class FileHolder {
  public serverResponse: any;
  public pending: boolean = false;
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
  max: number = 1;
  url: string="http://97ed60c2.ngrok.io";
  headers: Header[];
  @Input() acceptTypes : string[];
  @Input() styling: string='btn btn-primary';
  @Input() quality: string='65';
  @ViewChild('input') input;
  @ViewChild('url') urlField;
  @Output()
  private isPending: boolean;
  @Output()
  private onFileUploadFinish: EventEmitter<FileHolder> = new EventEmitter<FileHolder>();
  private errMsg: string;
  private errMsgShow: boolean;
  private files: FileHolder;
  private loadingImg: string="../../../assets/transfer.gif";
  private finishImg: string="../../../assets/double.png"
  private fileCounter: number = 0;
  private rotatingGif: string;
  private pendingFilesCounter: number = 0;

  private isFileOver:boolean = false;

  @Input()
  private buttonCaption: string = "Select Images";
  @Input()
  private uploadButtonCaption: string = "Select Images";

  @Input()
  private dropBoxMessage: string = "Drop your images here!";

  constructor(private imageService: ImageService) { }

  ngOnInit() {
    if(this.max==1){
      this.input.nativeElement.multiple = false;
    }
    this.isPending=false;
    this.imageService.setUrl(this.url);
    this.imageService.setQuality(this.quality);
  }

  fileChange(files) {
    this.errMsgShow=false;
    if (this.url) {
      this.isPending=true;
      this.rotatingGif=this.loadingImg;
    }


   let reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        let fileHolder: FileHolder = new FileHolder(event.target.result, files[0]);

        fileHolder.serverResponse = `good boy`;

        this.uploadSingleFile(fileHolder);

        this.files=fileHolder;

      }, false);


      reader.readAsDataURL(files[0]);
  }

  private uploadSingleFile(fileHolder: FileHolder) {
    if (this.url) {
      fileHolder.pending = true;

      this.imageService.postImage(fileHolder.file, this.headers).subscribe(response => {
        fileHolder.serverResponse = response;
        this.onFileUploadFinish.emit(response.InkBlob);
        fileHolder.pending = false;
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

  modal()
  {
    this.show();
   
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
