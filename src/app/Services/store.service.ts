import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {boyerMooreSearch} from '../../booyerMoore'


const URL = 0;
const DATA_BANK = 1;

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private needle: string
  private url: string
  private requestType: number;
  private dataVault: any;
  private headers: HttpHeaders;
  constructor(private http: HttpClient) {
    this.url='';
    this.needle='';
    this.requestType=URL;
    this.headers = new HttpHeaders()
      .set('content-type','application/json')
      .set('X-Requested-With','XMLHttpRequest')
      .set('Access-Control-Allow-Origin', '*')

  }

  public test(){
    this.http.get('http://192.168.30.30',{headers:this.headers}).subscribe((result:any)=>{
      console.log("TEST RESULT");
      console.log(result)
    })
  }

  public setEndPoint(url:string, needle: string){
    this.url = url;
    this.needle=needle;

    if((/.json$/).test(this.url)){
      this.requestType=DATA_BANK;
      this.http.get(this.url).subscribe((data:any) =>{
        if(data[0][this.needle]){
          this.dataVault = data;
        }else{
          console.log("Object inValidated.... %c[ERROR]",'color: red;font-weight: bolder');
        }
      })
      return;
    }
  }
  getStoreData(name: string = ''){
    return new Promise((resolve,reject )=>{
      if(this.requestType===DATA_BANK){
        let result: any = [];
        this.dataVault.forEach((data:any)=>{
          if(boyerMooreSearch(
            this.needle?data[this.needle].toUpperCase():data.toUpperCase(),
            name.toUpperCase()) >= 0
          ) { result.push(data); }
        });
        resolve(result);
      }else{
        this.http.get(this.url+name,{'headers':this.headers}).subscribe((data:any) =>{
          if(data[0] && !data[0][this.needle]){
            console.log("Needle settings dont match %c[ERROR]",'color: red;font-weight: bolder');
            reject({error:'needle settings dont match!'});
          }
          resolve(data);
        })
      }
    });
  }
}
