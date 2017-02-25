import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';


import {ImageUploadComponent} from "./image-upload/image-upload.component";
import {FileDropDirective} from "./file-drop.directive";
import {ImageService} from "./image.service";

@NgModule({
    imports: [CommonModule],
    declarations: [
        ImageUploadComponent,
        FileDropDirective
    ],
    providers: [ImageService],
    exports: [ImageUploadComponent]
})
export class OutgrowFileUploadModule {
    /* static forRoot(): ModuleWithProviders {
     return {
     ngModule: OutgrowFileUploadModule,
     providers: [ImageService]
     }
     }
     */
}
