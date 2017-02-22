import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {HighlightDirective} from './directive/highlight.directive';
import {HelloWorldModule} from './directive/hello-world/hello-world.module';
import { AppComponent } from './app.component';
import {ImageUploadModule} from './og-uploader/image-upload.module';

@NgModule({
  declarations: [
    AppComponent,
    HighlightDirective,
    
  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HelloWorldModule,
    ImageUploadModule.forRoot()
  ],
  exports:[
   HighlightDirective
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
