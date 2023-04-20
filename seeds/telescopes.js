const knex = require('knex')(require("../knexfile.js"));

const telescopesData = [
  {
    supplier_id: 1,
    model: "Celestron NexStar 8SE",
    type: "Schmidt-Cassegrain",
    aperture: 203,
    focalLength: 2032,
    mount: "Alt-Azimuth",
    accessories: "Eyepieces, finder scope",
    condition: "Excellent",
  },
  {
    supplier_id: 1,
    model: "Orion SkyQuest XT10g",
    type: "Dobsonian",
    aperture: 254,
    focalLength: 1200,
    mount: "Dobsonian",
    accessories: "Eyepieces, laser collimator",
    condition: "Excellent",
  }
];

exports.seed = async (knex) => {
    await knex('telescopes').del();
    await knex('telescopes').insert(telescopesData);
}