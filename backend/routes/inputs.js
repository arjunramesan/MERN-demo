const router = require('express').Router();
let Input = require('../models/inputs.model');

router.route('/').get((req, res) => {
  Input.find()
    .then(inputs => res.json(inputs))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const description = req.body.description;
  const detections = req.body.detections;
  const image = req.body.image;

  const newInput = new Input({
    username,
    description,
    detections,
    image
  });

  newInput.save()
  .then(() => res.json('Input added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Input.findById(req.params.id)
    .then(input => res.json(input))
    .catch(err => res.status(400).json('Error: ' + err));
});



module.exports = router;