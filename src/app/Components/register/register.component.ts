import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from '../../shared/text-input/text-input.component';
import { DatePickerComponent } from '../../shared/date-picker/date-picker.component';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextInputComponent,
    DatePickerComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister: EventEmitter<boolean> = new EventEmitter();
  maxDate: Date = new Date();
  validationErrors: string[] | undefined;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    // this.ReMatch();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  RegisterSubscription: Subscription = new Subscription();

  //  registerForm:FormGroup = this._formBuilder.group({
  //   gender:['male',[Validators.required]],
  //   username:['',[Validators.required]],
  //   knowAs:['',[Validators.required]],
  //   dateOfBirth:['',[Validators.required]],
  //   city:['',[Validators.required]],
  //   country:['',[Validators.required]],
  //   password:['',[Validators.required]],
  //   confirmPassword:['',[Validators.required,this.MatchValues('password')]]
  // });

  registerForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    userName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    // confirmPassword: new FormControl('', [
    //   Validators.required,
    //   this.MatchValues('password'),
    // ]),
    weight: new FormControl(null),
    reasonForJoining: new FormControl(''),
    dateOfBirth: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    role: new FormControl('trainee', Validators.required),
    address: new FormGroup(
      {
        city: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        street: new FormControl('', Validators.required),
        location: new FormGroup(
          {
            x: new FormControl('', Validators.required),
            y: new FormControl('', Validators.required),
          },
          Validators.required
        ),
      },
      Validators.required
    ),
  });

  // ReMatch(): void {
  //   this.registerForm.controls['password'].valueChanges.subscribe({
  //     next: (_) =>
  //       this.registerForm.controls['confirmPassword'].updateValueAndValidity(),
  //   });
  // }

  MatchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) =>
      control.value === control.parent?.get(matchTo)?.value
        ? null
        : { notMatching: true };
  }

  Register(registerFormValue: FormGroup): void {
    if (registerFormValue.valid) {
      const dob = this.GetDateOnly(
        registerFormValue.controls['dateOfBirth'].value
      );
      const values = { ...registerFormValue.value, dateOfBirth: dob };
      console.log(values);
      this.RegisterSubscription = this._authService
        .setTraineeRegister(values)
        .subscribe({
          next: (response) => {
            console.log(response);
            this._router.navigate(['/trainee-gym']);
          },
          error: (err) => {
            this.validationErrors = err; //will get it back form my interceptor arry error
            this._toastrService.error(err.error);
          },
        });
    } else registerFormValue.markAllAsTouched();
  }

  Cancel(): void {
    this.cancelRegister.emit(false);
    console.log('Cancelled');
  }

  private GetDateOnly(dob: string | undefined) {
    if (!dob) return;
    const theDob = new Date(dob);
    return new Date(
      theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset())
    )
      .toISOString()
      .slice(0, 10);
  }
}
