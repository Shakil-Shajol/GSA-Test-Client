import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateFormatter } from 'ngx-bootstrap/datepicker';
import { Gender } from 'src/app/models/gender';
import { GenderService } from 'src/app/services/gender.service';
import { StudentService } from 'src/app/services/student.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  form: FormGroup;
  studentId:number;
  genders:Gender[];
  formatedDate:Date;
  imageUrl:string="";
  selectedImage:File=null;
  constructor(private services:StudentService,private genderService:GenderService, private formBuilder: FormBuilder, private avRoute: ActivatedRoute, private router: Router) { 
    const idParam='id';
    if (this.avRoute.snapshot.params[idParam]) {
      this.studentId = this.avRoute.snapshot.params[idParam];
      console.log(this.studentId);
  }
    this.form=formBuilder.group({
      studentId:0,
        studentName:['',Validators.required],
        dateOfBirth:[null,Validators.required],
        genderId:[null,Validators.required]
    })
  }

  ngOnInit(): void {
    this.getGenders();
    this.services.getById(this.studentId).subscribe(res=>{
      this.formatedDate=res.dateOfBirth
      this.form.controls['studentId'].setValue(res.studentId),
      this.form.controls['studentName'].setValue(res.studentName),
      this.form.controls['dateOfBirth'].setValue(this.formatedDate),
      this.form.controls['genderId'].setValue(res.genderId),
      this.imageUrl=environment.baseUrl+res.picturePath
      console.log(res);
    })
  }

  getGenders(){
    this.genderService.get().subscribe(res=>{
      this.genders=res;
      console.log(this.genders);
    })
  }
  onSubmited(){
    const fd=new FormData();
    fd.append('studentId',this.form.get('studentId').value)
    fd.append('studentName',this.form.get('studentName').value);
    fd.append('dateOfBirth',this.form.get('dateOfBirth').value);
    fd.append('genderId',this.form.get('genderId').value);
    if (this.selectedImage!=null) {
      fd.append('picture',this.selectedImage,this.selectedImage.name);
    }
    console.log(this.form.get("studentId").value);
    console.log(this.form.get("studentName").value);
    console.log(this.form.get("dateOfBirth").value);
    console.log(this.form.get("genderId").value);
    this.services.update(fd).subscribe((res)=>{
      // this.toastr.success(res.studentId, 'Your ID');
      console.log(res);
      this.router.navigate(['/students'])
    },
    (err)=>console.log(err))
  }
  onImageSelected(event){
    this.selectedImage=<File>event.target.files[0];
    var reader=new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload=(e:any)=>{
      this.imageUrl=e.target.result;
    }
  }
}
