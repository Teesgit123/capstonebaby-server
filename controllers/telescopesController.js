const knex = require('knex')(require('../knexfile.js'));


exports.getTelescopes = async (req, res) => {
    return knex.transaction(async (trx) => {
        try {
            const telescopes = await trx('telescopes').select('*');

            const rentalTerms = await trx('rentalTerms').select('*');

            const details = [...telescopes, ...rentalTerms];
            
            await trx.commit();

            res.status(200).json(details);
        }
        catch (error) {
        console.log("Error from telescopesController");

        await trx.rollback();
        throw error;
    }


    })
}



// post request body:

/*
{
  "telescopeData": {
    "supplier_id": 1,
    "model": "Celestron NexStar 8SE",
    "type": "Schmidt-Cassegrain",
    "aperture": 203,
    "focalLength": 2032,
    "mount": "Alt-Azimuth",
    "accessories": "Eyepieces, finder scope",
    "condition": "Excellent"
  },
  "rentalTermsData": {
    "supplier_id": 1,
    "max_period": 30,
    "price_per_day": 50
  }
}








*/

exports.createTelescope = async (req, res) => {

    console.log(req.body);
    const { telescopeDetails, rentalTerms } = req.body;
    console.log(telescopeDetails);
    console.log(rentalTerms);
    return knex.transaction(async (trx) => {
        try {
            // insert telescope
            const [newTelescope] = await trx('telescopes').insert(telescopeDetails);

            // add telescope's id to the rental terms from the request
            rentalTerms.telescope_id = newTelescope.id;


            // insert rental terms
            const [newRentalTerms] = await trx('rentalTerms').insert(rentalTerms);
            // commit the submission
            await trx.commit();
            // return {telescope_entry, rentalTerms_entry};

            res.status(201).json({ newTelescope, newRentalTerms})
        }
        catch (error) {
            console.log("Error trying to insert new telescope and rental terms: ",error);

            await trx.rollback();

            res.status(500).json({ message: 'Error adding the telescope and rental terms.'})
        }
    })
}