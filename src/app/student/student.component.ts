import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Student } from "../models/student";
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  students:Student[];
  url:string=environment.baseUrl;

  constructor(public service:StudentService) { }

  ngOnInit(): void {
    this.getData();
  }


  getData(){
    this.service.get().subscribe(res=>{
      this.students=res;
      console.log(this.students);
    })
  }


  onDelete(id:number){
    const confirmation=confirm('Are you sure about delete the record?');
    if(confirmation){
      console.log(id);
      this.service.delete(id).subscribe(res=>{
        this.getData();
      })
    }
  }
}
