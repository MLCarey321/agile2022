// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("util/ensure");
const homePageView = require("./home_page_view");
const Rot13Client = require("../infrastructure/rot13_client");
const HttpRequest = require("http/http_request");
const WwwConfig = require("../www_config");
const Clock = require("infrastructure/clock");
const { homePage } = require("./home_page_view");

const INPUT_FIELD_NAME = "text";
const TIMEOUT_IN_MS = 5000;

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

		/*
		 * Hint: To implement this method, uncomment the following line.
		 */
		// return homePageView.homePage();
	}

	async postAsync(request, config) {
		ensure.signature(arguments, [ HttpRequest, WwwConfig ]);

		// your production code goes here
	}

};

async function transformAsync(rot13Client, clock, config, input) {
	try {
		const { transformPromise, cancelFn } = rot13Client.transform(config.rot13ServicePort, input);
		const output = await clock.timeoutAsync(
			TIMEOUT_IN_MS,
			transformPromise,
			() => timeout(config.log, cancelFn));
		return { output };
	}
	catch (outputErr) {
		config.log.emergency({
			message: "ROT-13 service error in POST /",
			error: outputErr,
		});
		return { outputErr };
	}
}

function timeout(log, cancelFn) {
	log.emergency({
		message: "ROT-13 service timed out in POST /",
		timeoutInMs: TIMEOUT_IN_MS,
	});
	cancelFn();
	return "ROT-13 service timed out";
}