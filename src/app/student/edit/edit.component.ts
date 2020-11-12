import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender } from 'src/app/models/gender';
import { GenderService } from 'src/app/services/gender.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  form: FormGroup;
  studentId:number;
  genders:Gender[];
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
      this.form.controls['studentId'].setValue(res.studentId),
      this.form.controls['studentName'].setValue(res.studentName),
      this.form.controls['dateOfBirth'].setValue(res.dateOfBirth),
      this.form.controls['genderId'].setValue(res.genderId)
      console.log(res);
    })
  }

  getGenders(){
    this.genderService.get().subscribe(res=>{
      this.genders=res;
      console.log(this.genders);
    })
  }
}
