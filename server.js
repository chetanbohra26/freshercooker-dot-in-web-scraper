const express = require('express');
const { pageHTML, udemy } = require('./functions');

const app = express();
app.get('/', (req, res) => {
	let page = req.query.page || 1;
	udemy(page).then(data => {
		res.send(pageHTML(data));
	})
});

const PORT = process.env.PORT || 7500;
app.listen(PORT, (err) => {
	if (err) throw err;
	console.log(`Listening on port ${PORT}..`);
});

