// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { HelloWorldComponent } from './hello-world.component';

@NgModule({
    imports: [

    ],
    declarations: [
        HelloWorldComponent,
    ],
    exports: [
        HelloWorldComponent,
    ]
})
export class HelloWorldModule {

}
