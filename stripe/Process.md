# Notes on what we are aiming / need to do with Stripe integration

At a High Level View:
 1 - manage the payments between customers and service providers (ie. renters and telescope owners, respectfully)

 2 - process the payments

 3 - store credit card / payment information so that we don't have to


More Specifically,

    1) Onboarding Telescope Owners:

        When a telescope owner signs up their telescope for rent, we need to create them an account on stripe.

            method from stripe:
                stripe.accounts.create({type, email}) 

                type: 'standard' || 'express' || 'custom'

                email: 'example@email.com'

    2) Account Linking and Onboarding:
        
        We need to create a link between our site and stripe, so that the user can onboard themselves, and then return to our site.
            
            method from stripe:
                stripe.accountLinks.create({account, refresh_url, return_url, type})

    3) Charging customers and creating transfers

        When someone rents a telescope, they need to pay. So we need to create that charge and send its information to stripe.

            method from stripe:
                stripe.charges.create({amount, currency, customer, destination, description})

        *                                            
            this will create a transfer to the connected account, moving the funds from the renter, to the telescope owner.
        *                                            


