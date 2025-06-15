import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { IMessage } from '../Interfaces/IMessage';
import { IGroup } from '../Interfaces/IGroup';
import { IUser } from '../Interfaces/IUser';
import { PaginatedResult } from '../Interfaces/IPagination';
import { HttpClient } from '@angular/common/http';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly baseUrl: string = environment.apiUrl;
  private readonly hubUrl: string = environment.hubUrl;
  private hubConnection?: HubConnection;
  private messagesThreadSource = new BehaviorSubject<IMessage[]>([]);
  messagesThread$ = this.messagesThreadSource.asObservable();

  constructor(private _httpClient: HttpClient) {}

  createHubConnection(user: IUser, otherUsername: string): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}/message?user=${otherUsername}`, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('ReceiveMessageThread', (messages) => {
      this.messagesThreadSource.next(messages);
    });

    this.hubConnection.on('UpdatedGroup', (group: IGroup) => {

      if (group.connections.some((c) => c.username === otherUsername)) {
        this.messagesThread$.pipe(take(1)).subscribe({
          next: (messages) => {
            messages.forEach((message) => {
              if (!message.dateRead) message.dateRead = new Date(Date.now());
            });
            this.messagesThreadSource.next([...messages]);
          },
        });
      }
    });

    this.hubConnection.on('NewMessage', (message) => {
      this.messagesThread$.pipe(take(1)).subscribe({
        next: (messages) =>
          this.messagesThreadSource.next([...messages, message]),
      });
    });
  }

  stopHubConnection(): void {
    if (this.hubConnection)
      this.hubConnection.stop().catch((error) => console.log(error));
  }

  getMessages(
    pageNumber: number,
    pageSize: number,
    container: string
  ): Observable<PaginatedResult<IMessage[]>> {
    let params = getPaginationHeaders(pageNumber, pageSize).append(
      'container',
      container
    );
    return getPaginatedResult<IMessage[]>(
      `${this.baseUrl}/messages`,
      params,
      this._httpClient
    );
  }

  getMessageThread(username: string): Observable<IMessage[]> {
    return this._httpClient.get<IMessage[]>(
      `${this.baseUrl}/messages/thread/${username}`
    );
  }

  async sendMessage(username: string, content: string): Promise<any> {
    return this.hubConnection
      ?.invoke('SendMessage', { recipientUsername: username, content })
      .catch((error) => console.log(error));
  }

  deleteMessage(messageId: number): Observable<any> {
    return this._httpClient.delete(`${this.baseUrl}/messages/${messageId}`);
  }


}
