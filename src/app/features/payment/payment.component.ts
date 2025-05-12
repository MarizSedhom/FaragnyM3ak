import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { loadStripe, Stripe, StripeElements, StripeElement, StripeCardElement, PaymentIntentResult, StripeError } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @ViewChild('cardElement') cardElement!: ElementRef;
  isProcessing: boolean = false;
  private elements: StripeElements | null = null;
  private card: StripeElement | null = null;
  private stripe: Stripe | null = null;

  constructor(
    private paymentService: PaymentService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.stripe = await this.paymentService['stripe'];
    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
          }
        }
      });
      this.card.mount(this.cardElement.nativeElement);
      (this.card as StripeCardElement).on('change', (event: { error?: { message: string } }) => {
        const displayError = document.getElementById('card-errors');
        if (displayError) {
          displayError.textContent = event.error ? event.error.message : '';
        }
      });
    }
  }

  async handlePayment() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    try {
      // Create payment intent for $9.99 (999 cents)
      const paymentIntent = await this.paymentService.createPaymentIntent(999);

      if (!this.stripe || !this.elements) {
        throw new Error('Stripe not initialized');
      }

      const result = await this.stripe.confirmCardPayment(paymentIntent.client_secret, {
      payment_method: {
        card: this.card as StripeCardElement,
      }
    });

    if (result.error) {
      throw result.error;
    }

    if (result.paymentIntent?.status === 'succeeded') {
      console.log('Payment successful:', result.paymentIntent);
      // Process the payment
      await this.paymentService.processPayment(paymentIntent.client_secret, 999);
      // Redirect to home page
      this.router.navigate(['/']);
    }
  } catch (error: any) {
    console.error('Payment error:', error);
    const displayError = document.getElementById('card-errors');
    if (displayError) {
      displayError.textContent = error.message || 'An error occurred during payment. Please try again.';
    }
  } finally {
    this.isProcessing = false;
  }
  }

  ngOnDestroy() {
    if (this.card) {
      this.card.destroy();
    }
  }
}
