// import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";
// import Stripe from "stripe";

// admin.initializeApp();

// const stripe = new Stripe(functions.config().stripe.secret, {
//   apiVersion: "2025-04-30.basil",
// });

// export const createPaymentIntent = functions.https.onRequest(
//   async (req, res) => {
//     // Set CORS headers first
//     res.set("Access-Control-Allow-Origin", "http://localhost:4200");
//     res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//     res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.set("Access-Control-Max-Age", "3600");

//     // Handle preflight OPTIONS request
//     if (req.method === "OPTIONS") {
//       // Return success immediately for preflight
//       res.status(204).end();
//       return;
//     }

//     if (req.method !== "POST") {
//       res.status(405).send("Method Not Allowed");
//       return;
//     }

//     try {
//       // Ensure request body is parsed correctly
//       const {amount} = typeof req.body === "string" ?
//         JSON.parse(req.body) :
//         req.body;

//       if (!amount) {
//         res.status(400).json({error: "Amount is required"});
//         return;
//       }

//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: amount,
//         currency: "usd",
//         automatic_payment_methods: {
//           enabled: true,
//         },
//       });

//       res.status(200).json({
//         clientSecret: paymentIntent.client_secret,
//       });
//     } catch (error: unknown) {
//       console.error("Error creating payment intent:", error);
//       res.status(500).json({
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//     }
//   }
// );
