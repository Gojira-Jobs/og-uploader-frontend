import { Observable } from "rxjs/Rx";
import { Http } from "@angular/http";
import 'rxjs/Rx';
export interface Header {
    header: string;
    value: string;
}
export declare class ImageService {
    private http;
    private url;
    private quality;
    setUrl(url: string): void;
    setQuality(quality: string): void;
    constructor(http: Http);
    postImage(image: File, headers?: Header[]): Observable<any>;
    linkupload(url: string, headers?: Header[]): Observable<any>;
    private checkUrl();
}
