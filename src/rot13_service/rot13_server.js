// Copyright Titanium I.T. LLC.
"use strict";

const ensure = require("util/ensure");
const HttpServer = require("http/http_server");
const Log = require("infrastructure/log");
const Rot13Router = require("./rot13_router");

/** Server for ROT-13 service */
module.exports = class Rot13Server {

	static create() {
		ensure.signature(arguments, []);
		return new this(HttpServer.create());
	}

	static createNull() {
		ensure.signature(arguments, []);
		return new this(HttpServer.createNull());
	}

	constructor(httpServer) {
		this._httpServer = httpServer;
		this._router = Rot13Router.create();
	}

	get isStarted() {
		return this._httpServer.isStarted;
	}

	get port() {
		return this._httpServer.port;
	}

	async startAsync(port, log) {
		ensure.signature(arguments, [ Number, Log ]);

		await this._httpServer.startAsync(port, log, request => this._router.routeAsync(request));
	}

};
