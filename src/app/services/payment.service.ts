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
    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${environment.stripeSecretKey}` // Replace with your Stripe Test Secret Key
      },
    body: new URLSearchParams({
        amount: amount.toString(),
        currency: 'usd', // You can change this to your preferred currency
        'payment_method_types[]': 'card' // Corrected: Array format for URLSearchParams
      })
    });

    const result = await response.json();
    if (response.ok) {
      return result; // This will contain the client_secret
    } else {
      throw new Error(result.error ? result.error.message : 'Failed to create payment intent');
    }
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
