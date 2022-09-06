import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { PublicMainComponent } from '../components/public/main.component';
// **gulpimport**

const routes: Routes = [
   {
    path: 'main',
    component: PublicMainComponent
}

// **gulproute**
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
         PublicMainComponent
// **gulpcomponent**
    ]
})

export class PublicRoutingModule { }
