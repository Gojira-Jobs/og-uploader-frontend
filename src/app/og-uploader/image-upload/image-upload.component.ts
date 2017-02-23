import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ImageService, Header} from "../image.service";

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
  @Input() max: number = 100;
  @Input() url: string;
  @Input() headers: Header[];
  @Input() preview: boolean = true;
  @Input() acceptTypes : string[];
  @Output()
  private isPending: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  private onFileUploadFinish: EventEmitter<FileHolder> = new EventEmitter<FileHolder>();
  @Output()
  private onRemove: EventEmitter<FileHolder> = new EventEmitter<FileHolder>();

  private files: FileHolder[] = [];

  private fileCounter: number = 0;
  private pendingFilesCounter: number = 0;

  private isFileOver:boolean = false;

  @Input()
  private buttonCaption: string = "Select Images";
  @Input()
  private dropBoxMessage: string = "Drop your images here!";

  constructor(private imageService: ImageService) { }

  ngOnInit() {
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

  private uploadFiles(files, filesToUploadNum) {
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

  private uploadSingleFile(fileHolder: FileHolder) {
    if (this.url) {
      this.pendingFilesCounter++;
      fileHolder.pending = true;

      this.imageService.postImage(fileHolder.file, this.headers).subscribe(response => {
        fileHolder.serverResponse = response;
        this.onFileUploadFinish.emit(fileHolder);
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
  }
  send(val:string)
  {
    this.hide();
  }
}
