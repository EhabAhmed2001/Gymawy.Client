import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InbodyService {
  // private endpoint = 'https://omar-khadrawy-inbody.hf.space/run/predict';
  private endpoint = 'https://omarkhadrawy-inbody.hf.space/predict';

  constructor(private http: HttpClient) {}

  predict(input: {
    name: string;
    age: number;
    sex: string;
    height: string;
    weight: string;
    report: string;
  }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      data: [
        input.name,
        input.age,
        input.sex,
        input.height,
        input.weight,
        input.report
      ]
    };

    return this.http.post(this.endpoint, body, { headers });
  }
}
