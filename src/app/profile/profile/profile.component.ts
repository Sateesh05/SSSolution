import { Component, OnInit } from '@angular/core';
import { employee } from '../../employee/employee';
import { employeeService } from 'src/app/employee/employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { departmentService } from 'src/app/department/department.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/toastr/toastr.service';
declare var jQuery: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public employee = new Array<employee>();
  public User = new employee();
  public image:string;
  public isImageSaved:boolean;
  public userprofile = new employee();
  public isFormSubmitted: boolean = null;
  
  public profiledata:FormGroup =  new FormGroup({
    file: new FormControl([null]),
    image:new FormControl()
  })
  public employeeData: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required,Validators.pattern("^[a-zA-Z ]*$"),
                            Validators.maxLength(20)]),
    gender: new FormControl(null, [Validators.required]),
    age: new FormControl(null, [Validators.required,Validators.pattern("^(?:1[8-9]|[2-5][0-9]|60)[a-zA-Z ]*$")]),
    mobileNumber: new FormControl(null, [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    address: new FormControl(null, [Validators.required]),
    designation: new FormControl(null, [Validators.required])
  })

  constructor(public service: employeeService,
    private departementService: departmentService,
    public fb: FormBuilder,
    private SpinnerService: NgxSpinnerService,
    private notifyService:NotificationService) {};
    
    showUpdateToaster() {
      this.notifyService.showSuccess("Record Updated Successfully !!", "Employee Profile ")
    };
    showErrormessage() {
      this.notifyService.showError('failed Record added!!', 'Employee Records')
    };
    showWarningMessage() {
      this.notifyService.showWarning('fill the popup fields', 'Warning')
    };
    showDuplicateWarningMessage() {
      this.notifyService.showWarning('Duplicate Email entry is not allowed', 'Warning')
    }
  ngOnInit(): void {
    var existing = localStorage.getItem('deptId')
    this.User = JSON.parse(existing);
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
    //this.SpinnerService.show();
    this.service.GetEmployeeByid(Id).subscribe((posRes) => {
      this.employee = posRes;
      console.log('getemployee by id,',this.employee);
      this.employee.forEach(elem => {
        this.departementService.getByIdDepartmentRecord(elem.department_id).subscribe((poRe) => {
          this.employee[0].department = poRe[0].name;
          this.User = this.employee[0];
          this.image = this.User.image;
          var existing = localStorage.getItem('deptId');
          // Otherwise, convert the localStorage string to an array
             existing = existing ? JSON.parse(existing) : {};
            // Add new data to localStorage Array
             existing['image'] = this.image;
           // Save back to localStorage
            localStorage.setItem('deptId', JSON.stringify(existing));
          if(this.image != "null" && this.image != undefined && this.image != ''){
            this.isImageSaved = true;
          }else{
            this.isImageSaved = false;
          }
        }, this.ErrorHandling)
      });
    }, this.ErrorHandling)
  };
  profileUpdate(){
    debugger
    this.userprofile = this.employee[0];
    jQuery('#m_title').html('Update Profile');
    jQuery("#profileModal").modal("show");
  }
  empInsertUpdate(){
    this.isFormSubmitted = true;
    debugger
    if(this.employeeData.valid){
      const id = this.userprofile.id;
      const data ={'employee':this.userprofile} 
      this.service.UpdateEmployeeProfile(id,data).subscribe((posres)=>{
        if(posres.update === 'success'){
          this.GetEmployeeById(this.User.id);
          this.userprofile = new employee();
          jQuery("#profileModal").modal("hide");
          this.showUpdateToaster();
          //this.PageRefresh();
        }
      })
    }
  }
  close() {
    this.isFormSubmitted = null;
    this.userprofile = new employee();
    this.fileLength = false;
  };
  private imageUrl:any;
onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      //  reader.addEventListener('load', (event: any) => {// called once readAsDataURL is completed
      //    this.url = event.target.result;
      //    this.profiledata.patchValue({
      //     image: reader.result
      //     });
       //})
        reader.onload = () => {
         this.imageUrl = reader.result;
        this.profiledata.patchValue({
          image: reader.result
        });
        var str = this.imageUrl;
        if("str!=''&&str!=null&&str!=undefined"){
        const imageString = str.split('');
        if (imageString.length * 2  < 2**16) {
          this.fileLength = false;
        }else{
          this.fileLength = true;
          //alert('File exceeds the maximum size')
        }
      }
    }
  }
}
  UpdateProfile(){
    jQuery('#m_Imgtitle').html('Update Profile Pic');
    jQuery("#profilePicModal").modal("show");
  }
  PageRefresh(): void {
    window.location.reload();
  }
  public fileLength:boolean;
  UpodateProfilePic(){
    debugger
    const id = this.User.id;
    this.userprofile.image = this.profiledata.value.image;
    const data ={'employee':this.userprofile} 
    this.service.UpdateProfilePic(id,data).subscribe((posRes)=>{
      if(posRes.update === 'success'){
        this.GetEmployeeById(this.User.id);
        this.PageRefresh();
        this.profiledata.reset();
      }
    })
  }
};
