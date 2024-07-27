const Joi = require("joi");
const express = require("express");
const e = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const events = [
  {
    id: 1,
    eventName: "Wine Tasting",
    eventDate: "03.09.2023",
    eventTime: "20:00",
  },
  {
    id: 2,
    eventName: "Beer Tasting",
    eventDate: "04.09.2023",
    eventTime: "19:00",
  },
];

// get the mainpage

app.get("/", (req, res) => {
  // get is a method of the express class and therefore available in the variable
  res.send("Hello World!!!"); // the "/" represents the root(landing pag{e) of the website
});

// get all events

app.get("/api/events", (req, res) => {
  res.send(events);
});

// add en event and evaluate input with Joi framework

app.post("/api/events", (req, res) => {
  const result = validateEvent(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  //  if (!req.body.name || req.body.name.length < 5) {
  //    res
  //      .status(400)
  //      .send("Name is required and should have minimum 5 characters");
  //    return;
  //  }

  const event = {
    id: events.length + 1,
    eventName: req.body.eventName,
    eventDate: req.body.eventDate,
    eventTime: req.body.eventTime,
  };
  events.push(event);
  res.send(event);
});

// get one particular event with ID

app.get("/api/events/:id", (req, res) => {
  let event = events.find((c) => c.id === parseInt(req.params.id));
  if (!event) res.status(404).send("This event was not found!");
  res.send(event);
});

// update an event

app.put("/api/events/:id", (req, res) => {
  let event = events.find((c) => c.id === parseInt(req.params.id));
  if (!event) res.status(404).send("This event was not found!");

  const result = validateEvent(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  event.eventName = req.body.eventName;
  res.send(event);
});

function validateEvent(event) {
  const schema = Joi.object({
    eventName: Joi.string().required(),
    eventDate: Joi.string().required(),
    eventTime: Joi.string().required(),
  });

  return schema.validate(event, { abortEarly: false });
}

// delete event

app.delete("/api/events/:id", (req, res) => {
  let event = events.find((c) => c.id === parseInt(req.params.id));
  if (!event) res.status(404).send("This event was not found!");

  const index = events.indexOf(events);
  events.splice(index, 1);

  res.send(events);
});

// define port

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening to port ${port}`));
