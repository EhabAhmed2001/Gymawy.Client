import { AfterViewChecked, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { IMessageBot } from '../../../Interfaces/IMessageBot';
import { ChatbotService } from '../../../Services/chatbot.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';
import { IOwnerInfo } from '../../../Interfaces/IOwnerInfo';
import { take } from 'rxjs';
import { IUser } from '../../../Interfaces/IUser';
import { GymOwnerService } from '../../../Services/gym-owner.service';
import { MembersService } from '../../../Services/members.service';
import { TraineeService } from '../../../Services/trainee.service';
import { IMember } from '../../../Interfaces/IMember';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule,MarkdownComponent,CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements OnInit,  AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  userMsg: string = '';
  loading: boolean = false;
  submitted: boolean = false;
   owner: IOwnerInfo | undefined;
   user: IUser | null = null;
   member: IMember | undefined;

  messages = signal<IMessageBot[]>([
    { role: 'assistant', content: 'Hello! How can I help you?' }
  ]);

  fitnessForm = {
    name: '',
    age: null,
    gender: '',
    height: null,
    weight: null,
    inbodyReport: ''
  };

  constructor(
    private _authService: AuthService,
    private service: ChatbotService,
    private _membersService: MembersService,
    private _traineeService: TraineeService,
    private _gymOwnerService: GymOwnerService,) { }
  ngOnInit(): void {
   this.GetCurrentUser();
  }


GetCurrentUser():void {
  this._authService.currentUser$.pipe(take(1)).subscribe({
    next: user => {
      this.user = user;
      console.log(this.user);

    }
    });
}


  ngAfterViewChecked() {
    this.scrollToBottom();
  }


  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }


  sendFormData() {
    // this.messages.set([{ role: 'assistant', content: 'Hello! How can I help you?' }]);

    const fullPrompt = `
    Please Act as InBody Fitness Analyzer Chatbot.
    User Fitness Info:
    - Name: ${this.fitnessForm.name}
    - Age: ${this.fitnessForm.age}
    - Gender: ${this.fitnessForm.gender}
    - Height: ${this.fitnessForm.height} cm
    - Weight: ${this.fitnessForm.weight} kg
    - InBody Report: ${this.fitnessForm.inbodyReport}
    - and my gym owner is ${this.owner?.userName || 'unknown'}.
    - and give me path to navigate to it { path: 'trainee-gym', component: TraineeLandingPageComponent, title: "Trainee Gym" }
    - using and this is base url http://localhost:4200 give me like to navigate to it. and i will press on it
    -build url using this data and give me the full url to navigate to it.http://localhost:4200/trainee-gym and make ancher tag with this name and my gym owner is ${this.user?.userName || 'unknown'} make like with lable ${this.user?.userName} and make color red of link
    Please respond in markdown sections in a good text formatted:
    ##📊 Analysis
    ...
    Take a space and separate them with a line
    ...
    ##⛹️ Training Plan
    ...
    Take a space and separate them with a line
    ...
    ##🍽️ Nutrition Plan
    ...
    Take a space and separate them with a line
    ...
    ##📆 Weekly Regime
    ...
    Take a space and separate them with a line
    ...
    and don't write the last sentence of feel free to ask any thing.
    `;

    // console.log(fullPrompt)

    this.loading = true;

    this.service.sendMessage([{ role: 'user', content: fullPrompt }]).subscribe({
      next: (res) => {
        const reply = res.choices[0].message.content;
        this.messages.update((msgs) => [...msgs, { role: 'assistant', content: reply }]);
        this.loading = false;

        setTimeout(() => this.scrollToBottom(), 0);
      },
      error: (err) => {
        this.messages.update((msgs) => [...msgs, { role: 'assistant', content: 'Error: ' + err.message }]);
        this.loading = false;
      }
    });
  }


  submitForm() {
    this.submitted = true;

    if (
      !this.fitnessForm.name ||
      !this.fitnessForm.age ||
      !this.fitnessForm.gender ||
      !this.fitnessForm.height ||
      !this.fitnessForm.weight ||
      !this.fitnessForm.inbodyReport
    ) {
      return;
    }
    this.sendFormData();
  }


  clear() {
    this.userMsg = '';
    this.submitted = false;

    this.fitnessForm = {
      name: '',
      age: null,
      gender: '',
      height: null,
      weight: null,
      inbodyReport: ''
    };

    this.messages.set([{ role: 'assistant', content: 'Hello! How can I help you?' }]);
  }


  sendMsg(msg: string) {
    if (!msg.trim()) return;

    const updated = [...this.messages(), { role: 'user', content: msg } as const];
    this.messages.set(updated);
    this.userMsg = '';
    this.loading = true;

    this.service.sendMessage(updated).subscribe({
      next: (res) => {
        const reply = res.choices[0].message.content;
        this.messages.update((msgs) => [...msgs, { role: 'assistant', content: reply }]);
        this.loading = false;

        setTimeout(() => this.scrollToBottom(), 0);
      },
      error: (err) => {
        this.messages.update((msgs) => [...msgs, { role: 'assistant', content: 'Error: ' + err.message }]);
        this.loading = false;
      }
    });
  }


  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMsg(this.userMsg);
    }
  }
}
