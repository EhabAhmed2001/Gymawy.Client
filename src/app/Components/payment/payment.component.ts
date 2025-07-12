import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { PaymentService } from '../../Services/payment.service';
import { PayFor } from '../../Interfaces/Payment/PaymentReturn';
import { TraineeService } from '../../Services/trainee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';


@Component({
  selector: 'app-payment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {

  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;

  paymentForm: FormGroup;
  showBack = false;
  showCVV = false;
  totalAmount = 0; // Example amount

  serviceId: number = 0;
  isProcessing = false;


  async ngOnInit() {
    this.stripe = await loadStripe(this._paymentService.publishKey);
    this.serviceId = Number(this.route.snapshot.paramMap.get('id'));
    this.totalAmount = this._paymentService.totalAmount;

    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.cardElement = this.elements.create('card', {
        style: {
          base: {
            color: '#000',
            fontSize: '16px',
            '::placeholder': { color: '#a0a0a0' }
          },
          invalid: {
            color: '#fa755a'
          }
        }
      });

      this.cardElement.mount('#stripe-card-element');
    }

    this.paymentForm = this.fb.group({
      cardNumber: ['', Validators.required],
      cardholderName: ['', Validators.required],
      expiryDate: ['', Validators.required],
      cvv: ['', Validators.required]
    });

  }


  constructor(private NavigationRoute:Router, private dialog: MatDialog, private fb: FormBuilder, private _paymentService: PaymentService, private _traineeService: TraineeService, private route: ActivatedRoute) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9\s]{19}$/)]],
      cardholderName: ['', Validators.required],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]]
    });

  }



  get cardNumber() {
    return this.paymentForm.get('cardNumber')?.value;
  }

  get cardholderName() {
    return this.paymentForm.get('cardholderName')?.value;
  }

  get expiryDate() {
    return this.paymentForm.get('expiryDate')?.value;
  }

  get cvv() {
    return this.showCVV ? this.paymentForm.get('cvv')?.value : '•••';
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    if (value.length > 16) value = value.substring(0, 16);

    let formatted = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += value[i];
    }

    this.paymentForm.get('cardNumber')?.setValue(formatted, { emitEvent: false });
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentForm.get('expiryDate')?.setValue(value, { emitEvent: false });
  }

  toggleCVVVisibility() {
    this.showCVV = !this.showCVV;
    const cvvControl = this.paymentForm.get('cvv');
    if (cvvControl) {
      cvvControl.setValue(cvvControl.value);
    }
  }

  async onSubmit() {
    if (this.paymentForm.valid) {
      const payFor = this._paymentService.payFor;
      this.isProcessing = true;

      if (payFor === PayFor.Membership) {
        this._traineeService.JoinIntoMembership(this.serviceId).subscribe({
          next: (response) => {
            this._paymentService.clientSecret = response.clientSecret;
            this.paymentComplete();
          },
          error: (error) => {

            const dialogRef = this.dialog.open(ErrorDialogComponent, {
              data: { message: error.error?.message || 'Failed to join membership.' }
            });
            this.isProcessing = false;

            setTimeout(() => dialogRef.close(), 3000);

          }
        })
      }

      else if (payFor === PayFor.Class) {
        this._traineeService.JoinToClass(this.serviceId).subscribe({
          next: (response) => {
            this._paymentService.clientSecret = response.clientSecret;
            this.paymentComplete();
          },
          error: (error) => {
            const dialogRef = this.dialog.open(ErrorDialogComponent, {
              data: { message: error.error?.message || 'Failed to join membership.' }
            });
            this.isProcessing = false;

            setTimeout(() => dialogRef.close(), 3000);
          }
        })
      }

      else if (payFor === PayFor.Feature) {
        this._traineeService.AddFeature(this.serviceId, this._paymentService.featureCount).subscribe({
          next: (response) => {
            this._paymentService.clientSecret = response.clientSecret;
            this.paymentComplete();
          },
          error: (error) => {
            const dialogRef = this.dialog.open(ErrorDialogComponent, {
              data: { message: error.error?.message || 'Failed to join membership.' }
            });
            this.isProcessing = false;

            setTimeout(() => dialogRef.close(), 3000);
          }
        })
      }
      else {
        console.error('Invalid payment type');
        return;
      }
    }
  }


  async paymentComplete() {

    const stripe = this.stripe;
    const name = this.paymentForm.get('cardholderName')?.value;
    if (!stripe || !this.cardElement) {
      console.error('Stripe or card element is not initialized.');
      return;
    }
    const { error, paymentIntent } = await stripe.confirmCardPayment(this._paymentService.clientSecret, {
      payment_method: {
        card: this.cardElement!,
        billing_details: { name }
      }
    });

    this.isProcessing = false;
    const dialogRef = this.dialog.open(SuccessDialogComponent);
    setTimeout(() => dialogRef.close(), 3000);

    this.NavigationRoute.navigate(['/subscriptions']);
  }
}