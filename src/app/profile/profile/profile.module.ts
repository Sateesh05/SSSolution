import { NgModule } from "@angular/core";
import { ProfileComponent } from './profile.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { employeeService } from 'src/app/employee/employee.service';
import { departmentService } from 'src/app/department/department.service';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations:[ProfileComponent],
  imports: [NgxSpinnerModule,MatIconModule,CommonModule,HttpClientModule,FormsModule,ReactiveFormsModule,RouterModule.forChild([
        {path:'',component:ProfileComponent}
    ])],
    providers:[employeeService,departmentService],
    exports:[ProfileComponent]
})
export class profileModule{}
