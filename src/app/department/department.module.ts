import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentComponent } from './department.component';
import { departmentService } from './department.service';
import {  RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from "ngx-spinner";
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [DepartmentComponent],
  imports: [CommonModule, MatTableModule, ReactiveFormsModule, NgxSpinnerModule, NgxPaginationModule, FormsModule, HttpClientModule, RouterModule.forChild([
    { path: '', component: DepartmentComponent }
  ])],
  providers: [departmentService],
  exports: [DepartmentComponent, MatTableModule]
})
export class departmentModule { }
