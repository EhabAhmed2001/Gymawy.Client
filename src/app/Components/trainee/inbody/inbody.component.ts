import { Component } from '@angular/core';
import { InbodyService } from '../../../Services/inbody.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inbody',
  imports: [FormsModule],
  templateUrl: './inbody.component.html',
  styleUrl: './inbody.component.css'
})
export class InbodyComponent {
GOTO() {
    window.open('https://gymawy-inbody.hf.space', '_Self');
}
  form = {
    name: '',
    age: 0,
    sex: 'Male',
    height: '',
    weight: '',
    report: ''
  };

  result: string = '';

  constructor(private inbodyService: InbodyService) {}

  submitForm() {
    this.inbodyService.predict(this.form).subscribe({
      next: (res) => {
        this.result = res.data[0]; // HTML output
      },
      error: (err) => {
        console.error(err);
        this.result = 'An error occurred.';
      }
    });
  }
}
