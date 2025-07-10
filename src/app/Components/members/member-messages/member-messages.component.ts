import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MessageService } from '../../../Services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-member-messages',
  imports: [CommonModule,TimeagoModule,FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?:NgForm;
  @Input() username?:string;
  // @Input() messages:IMessage[] = [];
  messageContent = '';

constructor(public _messageService:MessageService){}

  ngOnInit(): void {
  }



sendMessage():void{
    if(this.username){
      this._messageService.sendMessage(this.username,this.messageContent).then( () =>{
          this.messageForm?.reset();
      })
    }
  }

}
