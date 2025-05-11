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
  template: `
    <div class="payment-container">
      <h2>Subscribe to Premium</h2>
      <div class="pricing-info">
        <h3>Premium Plan</h3>
        <p class="price">$9.99/month</p>
        <ul class="features">
          <li>Unlimited access to all movies</li>
          <li>HD streaming quality</li>
          <li>No advertisements</li>
          <li>Multiple device support</li>
        </ul>
      </div>
      <div class="form-group">
        <label for="card-element">Credit or debit card</label>
        <div id="card-element" #cardElement></div>
        <div id="card-errors" role="alert" class="error-message"></div>
      </div>
      <button (click)="handlePayment()" [disabled]="isProcessing">
        {{ isProcessing ? 'Processing...' : 'Subscribe Now' }}
      </button>
      <p class="terms">By subscribing, you agree to our Terms of Service and Privacy Policy</p>
    </div>
  `,
  styles: [`
    .payment-container {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .pricing-info {
      text-align: center;
      margin-bottom: 30px;
    }
    .price {
      font-size: 2em;
      color: #6772e5;
      margin: 10px 0;
    }
    .features {
      list-style: none;
      padding: 0;
      margin: 20px 0;
    }
    .features li {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .form-group {
      margin-bottom: 20px;
    }
    #card-element {
      padding: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: #f8f9fa;
    }
    .error-message {
      color: #dc3545;
      font-size: 0.9em;
      margin-top: 8px;
    }
    button {
      width: 100%;
      background-color: #6772e5;
      color: white;
      padding: 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.1em;
      transition: background-color 0.3s;
    }
    button:hover {
      background-color: #5469d4;
    }
    button:disabled {
      background-color: #a5a5a5;
      cursor: not-allowed;
    }
    .terms {
      text-align: center;
      font-size: 0.8em;
      color: #666;
      margin-top: 20px;
    }
  `]
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

      const result = await this.stripe.confirmPayment({
        elements: this.elements,
        clientSecret: paymentIntent.client_secret,
        confirmParams: {
          return_url: `${window.location.origin}/register?payment=success`,
        }
      }) as { error?: StripeError; paymentIntent?: { status: string } };

      if (result.error) {
        throw result.error;
      }

      if (result.paymentIntent?.status === 'succeeded') {
        // Store payment information
        await this.paymentService.processPayment(paymentIntent.client_secret, 999);
        
        // Redirect to registration page
        this.router.navigate(['/register'], {
          queryParams: { payment: 'success' }
        });
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