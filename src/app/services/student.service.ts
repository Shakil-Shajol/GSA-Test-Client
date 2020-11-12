import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Student } from '../models/student';
import { StudentAdd } from '../models/student-add';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  url:string=environment.baseUrl+"api/Students"
  constructor(private http:HttpClient) { }

  get():Observable<Student[]>{
    return this.http.get<Student[]>(this.url);
  }

  getById(id:number):Observable<Student>{
    return this.http.get<Student>(this.url+"/"+id);
  }

  post(data):Observable<Student>{
    console.log(data);
    return this.http.post<Student>(this.url,data);
  }

  update(data):Observable<Student>{
    return this.http.put<Student>(this.url,data);
  }

  delete(id:number):Observable<any>{
    return this.http.delete(this.url+"/"+id);
  }
}
