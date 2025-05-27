import "dotenv/config"; // Charge les variables d’environnement automatiquement
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

    constructor() {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const stripeApiVersion = process.env.STRIPE_API_VERSION || '2025-04-30'; // ✅ Définition dynamique de la version

    if (!stripeKey) {
        throw new Error("❌ STRIPE_SECRET_KEY n'est pas défini dans .env !");
    }

    this.stripe = new Stripe(stripeKey, {
        apiVersion: stripeApiVersion as Stripe.LatestApiVersion, // ✅ Correction du type
    });

    console.log(`🔍 Stripe initialisé avec la version : ${stripeApiVersion}`);
    }


  async createPaymentIntent(amount: number, currency: string) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100, // Convertir en centimes
      currency,
    });

    return paymentIntent.client_secret; // Clé secrète pour finaliser le paiement
  }
}