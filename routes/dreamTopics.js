//DT162G Projekt - REST API, av Alice Fagerberg
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(
    bodyParser.urlencoded({
      extended: true
    })
)
router.use(bodyParser.json());

//initiera databasanslutning
 const mongoose = require('mongoose');
 mongoose.connect('mongodb+srv://dreamer1:dream123@dt162gproject.ioupc.mongodb.net/dt162gProject?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
 mongoose.Promise = global.Promise; // Global use of mongoose
 
 const db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', function (callback) { // Lägger till lyssnare för db event 
	 console.log("Connected to db");

	 // Skapa DB schema 
	 const dreamtopicSchema = mongoose.Schema(
	{
        topic: String,
		tMeaning: String,
		created: Date
    },
	
	);

    // Skapa schema model
    const Dreamtopic = mongoose.model('Dreamtopic', dreamtopicSchema )


//get-Hämta alla dreamtopics
router.get('/', function(req, res, next) {

	// Läs ut från databasen
	Dreamtopic.find(function(err, dtopics) {
	  if(err) return console.error(err);  
	  const jsonObj = JSON.stringify(dtopics);
	  res.contentType('application/json');
	  res.send(jsonObj);
	});
  });


  //get - hämtar dreamtopic utifrån id
  router.get('/:id', function(req, res, next) {

	const id = req.params.id;


	// Läs ut från databasen
	Dreamtopic.find({"_id": id}, function(err, dtopics) {
	  if(err) return console.error(err);  
	  const jsonObj = JSON.stringify(dtopics);
	  res.contentType('application/json');
	  res.send(jsonObj);
	});
  });
  
  //delete-Radera dreamtopic utifrån id
  router.delete('/:id', function(req, res, next) {
	  const id = req.params.id;
	  
	  // Radera course _id från db
	  Dreamtopic.deleteOne({ "_id": id }, function (err) {
		  if (err) return handleError(err);
	  });
	  
	  // Läs ut ny dreamtopiclista från db som response data
	  Dreamtopic.find(function(err, dtopics) {
		  if(err) return console.error(err);
	  
		  const jsonObj = JSON.stringify(dtopics);
		  res.contentType('application/json');
		  res.send(jsonObj);
	  });
  });
  
  //Lägg till ny dreamtopic
  router.post('/',  async function(req, res, next) {

	  // Skapa ny dreamtopic
	  const dtopic = new Dreamtopic({ 
		topic: req.body.topic, 
		tMeaning: req.body.tMeaning,
		created: req.body.created,

	  });	
  
	  // Spara ny dreamtopic till db
	  await dtopic.save(function(err) {
		  if(err) return console.error(err);
	  });
  
	  const jsonObj = JSON.stringify(dtopic);
	  res.contentType('application/json');
	  res.send(jsonObj);
  
  });

  //Uppdatera dreamtopic
  router.put('/:id', function(req, res, next) {
	//Hitta dreamtopic utifrån id och uppdatera
	Dreamtopic.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
	  if (err) {return next(err);}
	  else
	  res.json(post);
	});
  });
  
});

  

module.exports = router;
