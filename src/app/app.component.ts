import { Component, ViewChild,HostListener } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  val:boolean=false;
 


  @ViewChild('image')
   image;


  
  fileChange(files)
  {
    console.log(files);

  }
  imageUploaded(response:any){
    console.log(response);
  }

  imageRemoved(response: any){
    console.log(response);
  }
}
