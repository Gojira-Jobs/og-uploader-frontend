import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";
export interface Header {
  header: string;
  value: string;
}

@Injectable()
export class ImageService {
  private url: string;

  public setUrl(url: string) {
    this.url = url;
  }
  constructor(private http:Http)
  {

  }

   postImage(image: File, headers?: Header[]): Observable<any> {
    this.checkUrl();
    let formData: FormData = new FormData();
    formData.append('image',image);
    console.log("file from service");
    console.log(image);
    return this.http.post(this.url,formData,headers);
   
  }
  linkupload(url:string):Observable<any>
  {
    let link={'link':url};
    console.log("lonk");
    return this.http.post(this.url,link);

  }

  private checkUrl() {
    if (!this.url) {
      throw new Error('Url is not set! Please use setUrl(url) method before doing queries');
    }
  }

}
