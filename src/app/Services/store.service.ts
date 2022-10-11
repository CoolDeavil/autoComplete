import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private url: string
  constructor(private http: HttpClient) {
    this.url='';
  }
  public setEndPoint(url:string){
    this.url = url;
  }

  getCountry(name: string = ''){
    return new Promise((resolve,reject )=>{
      this.http.get(this.url+name).subscribe(data =>{
        resolve(data);
      })
    });

  }

}
