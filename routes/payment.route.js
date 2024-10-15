const express=require('express');
const router = express.Router();
const stripe = require ('stripe');
const Stripe = stripe('sk_test_51LPiuwJrAgLp47RRfBG034RmkceXlk1OVxBft9yEPuwawbG9rC1xQ0fFH49mT5JWRTcBKMEJfPcdAyYAmWdu74ud008LGYOVVH');

/*
router.post('/', async (req, res) => {
    let status, error;
    const { token, amount } = req.body;
    try {
      await Stripe.charges.create({
        source: token.id,
        amount,
        currency: 'usd',
      });
      status = 'success';
    } catch (error) {
      console.log(error);
      status = 'Failure';
    }
   
    res.json({ error, status});
  });

  */

  router.post('/', async (req, res) => { 

    try {
        const session = await Stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: req.body.cart.cartItems.map(item => {
           
            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: item.designation,
                },
                unit_amount: item.prix*100,
              },
              quantity: item.cartQuantity,
            }
          }),
          success_url: `${process.env.CLIENT_URL}`,
          cancel_url: `${process.env.CLIENT_URL}`,
        })
    

          res.json({ sessionId: session.id })
      } catch (e) {
        res.status(500).json({ error: e.message })
      }
  });

  router.get('/recuperer-details-transaction/:sessionID', async (req, res) => {
 
    try {
            
        const sessionID=req.params.sessionID
        
        const session = await Stripe.checkout.sessions.retrieve(
          sessionID
        );
        const nomClient = session.customer_details.name;
        const emailClient = session.customer_details.email;

        res.json({nomClient, emailClient });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

  module.exports = router;
