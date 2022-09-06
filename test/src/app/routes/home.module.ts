import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared.module';
import { RouterModule } from '@angular/router';
import { HomeTestComponent } from '../components/home/test.component';
// **gulpimport**

@NgModule({
    imports: [
        SharedModule,
        RouterModule
    ],
    declarations: [
         HomeTestComponent
// **gulpcomponent**
    ],
    exports: [
        HomeTestComponent
// **gulpcomponent**
    ]
})

export class HomeModule { }
