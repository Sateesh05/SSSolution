import { NgModule } from "@angular/core";
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [HomeComponent],
    imports:[RouterModule.forChild([
        {path:'',component:HomeComponent}
    ])],
    providers: [],
    exports: [HomeComponent]
})
export class homeModule{}