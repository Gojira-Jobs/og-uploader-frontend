import { Directive, ElementRef, Input ,OnChanges} from '@angular/core';
import {HelloWorldComponent} from "./hello-world/hello-world.component";
@Directive({ selector: '[myHighlight]'


 })
export class HighlightDirective {
    @Input('myHighlight') value;
    constructor(el: ElementRef) {

       el.nativeElement.style.backgroundColor = 'green';
    }
    ngOnChanges(changes){
        console.log(this.value);
    }
}
