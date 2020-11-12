import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Gender } from "../models/gender";

@Injectable({
  providedIn: 'root'
})
export class GenderService {
  url:string=environment.baseUrl+"api/Genders"
  constructor(private http:HttpClient) { }

  get():Observable<Gender[]>{
    return this.http.get<Gender[]>(this.url);
  }
}
