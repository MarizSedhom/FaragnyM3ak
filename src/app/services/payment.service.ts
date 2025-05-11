import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripe: Promise<Stripe | null>;
  private paymentInfo: any = null;
  private apiUrl = 'https://us-central1-helloiti.cloudfunctions.net/createPaymentIntent';

  constructor(private router: Router) {
    this.stripe = loadStripe(environment.stripePublicKey);
  }

  async createPaymentIntent(amount: number) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async processPayment(clientSecret: string, amount: number) {
    try {
      // Store payment information temporarily
      this.paymentInfo = {
        paymentIntentId: clientSecret.split('_secret_')[0],
        amount: amount,
        status: 'succeeded',
        timestamp: new Date().toISOString()
      };

      // Store in sessionStorage for persistence across page reloads
      sessionStorage.setItem('paymentInfo', JSON.stringify(this.paymentInfo));

      return this.paymentInfo;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  getPaymentInfo() {
    if (!this.paymentInfo) {
      const storedInfo = sessionStorage.getItem('paymentInfo');
      if (storedInfo) {
        this.paymentInfo = JSON.parse(storedInfo);
      }
    }
    return this.paymentInfo;
  }

  clearPaymentInfo() {
    this.paymentInfo = null;
    sessionStorage.removeItem('paymentInfo');
  }

  // Method to verify if payment was successful
  isPaymentSuccessful(): boolean {
    const paymentInfo = this.getPaymentInfo();
    return paymentInfo && paymentInfo.status === 'succeeded';
  }
} 