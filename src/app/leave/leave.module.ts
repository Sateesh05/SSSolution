import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { LeaveComponent } from './leave.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeaveService } from './leave.service';
import { employeeService } from '../employee/employee.service';
import { departmentService } from '../department/department.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [LeaveComponent],
  imports: [ReactiveFormsModule,MatIconModule,NgxSpinnerModule,NgxPaginationModule,CommonModule,HttpClientModule,FormsModule,RouterModule.forChild([
        { path: '', component: LeaveComponent }
    ])],
    providers: [employeeService, departmentService, LeaveService],
    exports: [LeaveComponent]
})
export class LeaveModule { }
