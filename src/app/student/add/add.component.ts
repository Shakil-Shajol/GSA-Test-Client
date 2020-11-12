import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { Gender } from "src/app/models/gender";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GenderService } from 'src/app/services/gender.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  genders:Gender[];
  selectedImage:File=null;
  form:FormGroup;
  imageUrl:string='./assets/Images/profile.png';
  formErrors: any;
  validationMessages: any;
  constructor(private service:StudentService,private genderService:GenderService,private fb:FormBuilder) { 
    this.form=new FormGroup({
      'studentName':new FormControl(null),
      'dateOfBirth':new FormControl(null),
      'genderId':new FormControl(null)
    })
  }

  ngOnInit(): void {
    this.getGenders();
    this.form=this.fb.group({
      studentName:['',Validators.required],
      dateOfBirth:[null,Validators.required],
      genderId:[null,Validators.required]
    });
    this.form.valueChanges.subscribe((data)=>{
      this.logValidationErrors(this.form)
    });

  }

  onImageSelected(event){
    this.selectedImage=<File>event.target.files[0];
    var reader=new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload=(e:any)=>{
      this.imageUrl=e.target.result;
    }
  }
  onSubmited(){
    const fd=new FormData();
    fd.append('studentName',this.form.get('studentName').value);
    fd.append('dateOfBirth',this.form.get('dateOfBirth').value);
    fd.append('genderId',this.form.get('genderId').value);
    fd.append('picture',this.selectedImage,this.selectedImage.name);
    console.log(this.form.get("studentName").value);
    console.log(this.form.get("dateOfBirth").value);
    console.log(this.form.get("genderId").value);
    this.service.post(fd).subscribe((res)=>{
      // this.toastr.success(res.studentId, 'Your ID');
      console.log("under this")
      console.log(res);
    },
    (err)=>console.log(err))
  }
  getGenders(){
    this.genderService.get().subscribe(res=>{
      this.genders=res;
      console.log(this.genders);
    })
  }

  logValidationErrors(group:FormGroup=this.form):void{
    Object.keys(group.controls).forEach((key: string)=>{
      const abstractControl =group.get(key);

        this.formErrors[key]='';
        if (abstractControl && !abstractControl.valid && (abstractControl.touched||abstractControl.dirty)) {
          const messages=this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
            
          }
        }
        if (abstractControl instanceof FormGroup) {
          this.logValidationErrors(abstractControl);
        }

    })
  }
}
