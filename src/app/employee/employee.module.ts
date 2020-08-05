import { NgModule } from '@angular/core';
import { EmployeeComponent } from './employee.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { employeeService } from './employee.service';
import { departmentService } from '../department/department.service';
import { LeaveService } from '../leave/leave.service';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
    declarations: [EmployeeComponent],
  imports: [NgxPaginationModule,CommonModule, HttpClientModule, FormsModule, RouterModule.forChild([
        { path: '', component: EmployeeComponent }
    ])],
    providers: [employeeService, departmentService, LeaveService],
    exports: [EmployeeComponent]

})
export class EmployeeModule { }
