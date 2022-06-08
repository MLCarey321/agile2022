// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("util/ensure");
const homePageView = require("./home_page_view");
const Rot13Client = require("../infrastructure/rot13_client");
const HttpRequest = require("http/http_request");
const WwwConfig = require("../www_config");
const Clock = require("infrastructure/clock");
const { homePage } = require("./home_page_view");

/** Endpoints for / (home page) */
module.exports = class HomePageController {

	static create() {
		ensure.signature(arguments, []);
		return new HomePageController(Rot13Client.create(), Clock.create());
	}

	static createNull({
		rot13Client = Rot13Client.createNull(),
		clock = Clock.createNull(),
	} = {}) {
		ensure.signature(arguments, [[ undefined, {
			rot13Client: [ undefined, Rot13Client ],
			clock: [ undefined, Clock ],
		}]]);
		return new HomePageController(rot13Client, clock);
	}

	constructor(rot13Client, clock) {
		this._rot13Client = rot13Client;
		this._clock = clock;
	}

	getAsync(request, config) {
		ensure.signature(arguments, [ HttpRequest, WwwConfig ]);

		return homePageView.homePage();


		/*
		 * Hint: To implement this method, uncomment the following line.
		 */
		// return homePageView.homePage();
	}

	async postAsync(request, config) {
		ensure.signature(arguments, [ HttpRequest, WwwConfig ]);

		const body = await request.readBodyAsync();
		const formData = new URLSearchParams(body);
		const textFields = formData.getAll("text");
		if (textFields.length === 0) {
			config.log.monitor({
				message: "form parse error in POST /",
				details: "'text' form field not found",
				body,
			});
			return homePageView.homePage();
		}

		const userInput = textFields[0];
		const output = await this._rot13Client.transformAsync(config.rot13ServicePort, userInput);

		return homePageView.homePage(output);

		// your production code goes here
	}

};
