const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const fetch = require("node-fetch");
require("dotenv").config(); // Get env variables
const port = process.env.PORT;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(pino);

function checkStatus(res) {
	if (res.ok) {
		return res;
	} else {
		throw res;
	}
}
app.get("/api/random-photo", (req, res) => {
	const url = "https://api.unsplash.com/photos/random";
	const clientID = process.env.API_KEY;
	const options = {
		headers: {
			Authorization: `Client-ID ${clientID}`
		}
	};
	fetch(url, options)
		.then(checkStatus)
		.then(res => res.json())
		.then(image => res.send(image.urls))
		.catch(err =>
			res.send({ error: "There was a problem, " + err.statusText })
		);
});
app.post("/api/search-photos", (req, res) => {
	const query = req.body.query;
	const page = req.body.page;
	const perPage = req.body.perPage;

	const url = `https://api.unsplash.com/search/photos?page=${page}&per_page=${perPage}&query=${query}`;
	const clientID = process.env.API_KEY;
	const options = {
		headers: {
			Authorization: `Client-ID ${clientID}`
		}
	};
	fetch(url, options)
		.then(checkStatus)
		.then(res => res.json())
		.then(data => res.send(data))
		.catch(err =>
			res.send({ error: "There was a problem, " + err.statusText })
		);
});

app.listen(port, () => console.log(`Server is running on ${port}`));
