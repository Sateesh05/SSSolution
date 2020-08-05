import { NgModule } from "@angular/core";
import { LeaveComponent } from './leave.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LeaveService } from './leave.service';
import { employeeService } from '../employee/employee.service';
import { departmentService } from '../department/department.service';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
    declarations: [LeaveComponent],
  imports: [NgxPaginationModule,CommonModule,HttpClientModule,FormsModule,RouterModule.forChild([
        { path: '', component: LeaveComponent }
    ])],
    providers: [employeeService, departmentService, LeaveService],
    exports: [LeaveComponent]
})
export class LeaveModule { }
