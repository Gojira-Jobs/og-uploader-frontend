import { Component, ViewChild } from '@angular/core';
import {HighlightDirective} from './directive/highlight.directive';
import {HelloWorldComponent} from './directive/hello-world/hello-world.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  val:boolean=false;
  @ViewChild('image') image;
  title = 'app works!';
  fileChange(files)
  {
    console.log(files);

  }
  imageUploaded(response:any){
    console.log(response);
    //this.image.nativeElement.src="http://dddcfcd9.ngrok.io/"+response.fileName;
  }

  imageRemoved(response: any){
    console.log(response);
  }
}
