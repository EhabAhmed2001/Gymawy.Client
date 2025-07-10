import { Injectable } from '@angular/core';
import { PayFor } from '../Interfaces/Payment/PaymentReturn';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() { }

  publishKey = 'pk_test_51OFjLQKjftOmQdlyWZDq1FVkp7uDV7DI90LIraGcwyyFBZUwdWcJpCpHSMZURGHTTeQ0IKwQiIS8lJVxCmTwEWOM00Ji17h5Yh';
  clientSecret = '';
  payFor: PayFor = PayFor.Membership; // Default payment type
  totalAmount = 0; // Default total amount

  featureCount = 1; // Default feature count
}
