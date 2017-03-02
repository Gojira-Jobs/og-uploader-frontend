# og-uploader

Simple File Upload for Angular2.
Please star a project if you liked it, or create an issue if you have problems with it.

## Installation
 Install npm module:
    
    `npm install og-uploader --save`


## Usage

Import `OutgrowFileUploadModule` in your app and start using a component:

```html
<og-uploader [acceptTypes]="['image/*']"
             [styling]="'btn-danger btn-lg'"
             [quality]="60"
             [buttonCaption]="'The button we all wanted!!'"
             (onFileUploadFinish)="imageUploaded($event)"   
></og-uploader>
```
* `[acceptTypes]="['image/*','text/*']"` specifies accepted file mime types.
* `[styling]="'btn-danger'"` pass css class for styling of the button you will get with this module.
* `[quality]="60` compression ratio percentage.
* `[buttonCaption]="submit image"`set the button caption.
* `(onFileUploadFinish)="imageUploaded($event)"` is fired when image upload is completed. "$event" object contains the response from the server.
  
