import { Component ,OnInit} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'hello-world',
    templateUrl: 'hello-world.component.html'
})
export class HelloWorldComponent implements OnInit {
       val:boolean;
       ngOnInit()
       {
         this.val=false;
       }
       
       load()
       {
           this.val=true;
           console.log(this.val);
        
       }
}
