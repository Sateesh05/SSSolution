import { Component, OnInit } from '@angular/core';
import { User } from '../user'
import { employeeService } from 'src/app/employee/employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { departmentService } from 'src/app/department/department.service';
declare var jQuery: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  public employee = new Array<User>();
  private User = new User();
  constructor(public service: employeeService,
    private departementService: departmentService) {
    var item = localStorage.getItem('deptId')
    var userdata = JSON.parse(item);
    this.User = userdata;
  };
  ngOnInit(): void {
    this.GetEmployeeById(this.User.id);
  };
  ErrorHandling = (errRes: HttpErrorResponse) => {
    if (errRes.error instanceof Error) {
      console.log('server side error')
    } else {
      console.log('client side error')
    };
  }
  GetEmployeeById(Id: number) {
    this.service.GetEmployeeByid(Id).subscribe((posRes) => {
      this.employee = posRes;
      console.log(this.employee);
      this.employee.forEach(elem => {
        this.departementService.getByIdDepartmentRecord(elem.department_id).subscribe((poRe) => {
          console.log(poRe);
          this.employee[0].department = poRe[0].name;
        }, this.ErrorHandling)
      });
    }, this.ErrorHandling)
  };
};
