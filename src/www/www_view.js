// Copyright Titanium I.T. LLC.
"use strict";

const HttpResponse = require("http/http_response");

/** Overall HTML template for WWW site */
exports.pageTemplate = function(title, body) {
	return `
		<html lang="en">
		<head>
			<title>${title}</title>
		</head>
		<body>${body}</body>
		</html>
	`;
};

/** Error page response */
exports.errorPage = function(status, message) {
	const title = `${status}: ${message}`;
	const body = `<p>${message}</p>`;

	return HttpResponse.createHtmlResponse({
		status,
		body: exports.pageTemplate(title, body),
	});
};
