import { Component, ElementRef, OnInit } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { Gender } from "src/app/models/gender";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GenderService } from 'src/app/services/gender.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { getDate, addMonths,addYears } from '@progress/kendo-date-math';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  
  genders:Gender[];
  selectedImage:File=null;
  selectedFileName:string="";
  form:FormGroup;
  imageUrl:string='./assets/Images/profile.png';
  formErrors: any;
  validationMessages: any;
  dpConfig:Partial<BsDatepickerConfig>;
  formatedDate:Date;
  constructor(private service:StudentService,private genderService:GenderService,private fb:FormBuilder,private router:Router,private angular:ElementRef) { 
    this.form=new FormGroup({
      'studentName':new FormControl(null),
      'dateOfBirth':new FormControl(null),
      'genderId':new FormControl(null)
    });
    this.dpConfig=Object.assign({},{containerClass:'theme-dark-blue',showWeekNumbers:false,dateInputFormat:"DD-MM-YYYY",adaptivePosition: true})
  }

  clickUpload(event:any){
      event.preventDefault();
      let element: HTMLElement=document.getElementById('openFile') as HTMLElement;
      element.click();
  }
  
  ngOnInit(): void {
    this.getGenders();
    this.form=this.fb.group({
      studentName:['',Validators.required],
      dateOfBirth:[null,Validators.required],
      genderId:[null,Validators.required]
    });
    this.form.valueChanges.subscribe((data)=>{
    });

  }

  onImageSelected(event){
    this.selectedImage=<File>event.target.files[0];
    this.selectedFileName=event.target.files[0].name;
    var reader=new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload=(e:any)=>{
      this.imageUrl=e.target.result;
    }
  }
  onSubmited(){
    const fd=new FormData();
    fd.append('studentName',this.form.get('studentName').value);
    fd.append('dateOfBirth',this.convert(this.form.get('dateOfBirth').value));
    fd.append('genderId',this.form.get('genderId').value);
    fd.append('picture',this.selectedImage,this.selectedImage.name);
    console.log(this.form.get("studentName").value+" Name");
    console.log(this.form.get("dateOfBirth").value+" dob");
    console.log(this.form.get("genderId").value+" gId");
    this.service.post(fd).subscribe((res)=>{
      console.log(res);
      this.router.navigate(['/students'])
    },
    (err)=>console.log(err))
  }
  getGenders(){
    this.genderService.get().subscribe(res=>{
      this.genders=res;
      console.log(this.genders);
    },(err)=>{
      this.genders=[
        {genderId:1,genderName:"Male"},
        {genderId:2,genderName:"Female"}
      ];
      console.log("API is not working, demo value is presenting.");
    })
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  public max: Date = addYears(getDate(new Date()), -12);
}
