# og-uploader

Simple File Upload for Angular2.
Please star a project if you liked it, or create an issue if you have problems with it.

## Installation

1. Install npm module:
    
    `npm install og-builder --save`


## Usage

Import `OutgrowFileUploadModule` in your app and start using a component:

```html
<og-uploader [acceptTypes]="['image/*']"
             [styling]="'btn-danger btn-lg'"
             [quality]="60"
             [uploadButtonCaption]="'Select Images!'"
             [buttonCaption]="'The button we all wanted!!'"
             [dropBoxMessage]="'Drop your images here!'"
             (onFileUploadFinish)="imageUploaded($event)"
             (onRemove)="imageRemoved($event)"   
></og-uploader>
```
* `[acceptTypes]="['image/*','text/*']"` specifies file mime types.
* `[styling]="'btn-danger'"` pass css class for styling.
* `[quality]="60` compression ratio percentage.
* `[uploadButtonCaption]="select images` set upload button caption.
* `[buttonCaption]="submit image"`set submit button caption.
* `[dropBoxMessage]="Drop your images here"` placeholder message.
* `(onFileUploadFinish)="imageUploaded($event)"` is fired when image upload is completed.
* `(onRemove)="imageRemoved($event)"` is fire when image is removed
  
