import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMessageBot } from '../Interfaces/IMessageBot';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private url: string = "https://api.openai.com/v1/chat/completions";
  private apiKey: string = "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";

  constructor(private httpClient: HttpClient) { }


  sendMessage(messages: IMessageBot[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.9,
      stream: false
    };

    return this.httpClient.post(this.url, body, { headers });
  }
}
