import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Http, Response} from "@angular/http";
import 'rxjs/Rx';

export interface Header {
  header: string;
  value: string;
}

@Injectable()
export class ImageService {
  private url: string;
  private quality: string;

  public setUrl(url: string) {
    this.url = url;
  }

  public setQuality(quality: string) {
    this.quality = quality;
  }

  constructor(private http: Http) {

  }

  postImage(image: File, headers?: Header[]): Observable<any> {
    this.checkUrl();
    let formData: FormData = new FormData();
    formData.append('image', image);
    formData.append('quality', this.quality);
    console.log("file from service");
    console.log(image);
    return this.http.post(this.url, formData, headers)
      .map((res: Response) => {
        console.log(res.json());
        return res.json();
      });

  }

  linkupload(url: string, headers?: Header[]): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('link', url);
    formData.append('quality', this.quality);
    console.log("link");
    console.log(formData);
    return this.http.post(this.url, formData, headers)
      .map((res: Response) => {
        console.log(res.json());
        return res.json();
      });

  }

  private checkUrl() {
    if (!this.url) {
      throw new Error('Url is not set! Please use setUrl(url) method before doing queries');
    }
  }

}
