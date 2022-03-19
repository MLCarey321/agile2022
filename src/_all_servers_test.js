// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("util/assert");
const ensure = require("util/ensure");
const AllServers = require("./all_servers");
const CommandLine = require("infrastructure/command_line");
const WwwServer = require("./www/www_server");
const Rot13Server = require("./rot13_service/rot13_server");

const VALID_ARGS = [ "1000", "2000" ];

describe("All servers", () => {


	describe("happy path", () => {

		it("starts servers", async () => {
			const { wwwServer, rot13Server } = await startAsync();

			assert.equal(wwwServer.isStarted, true, "www server should be started");
			assert.equal(rot13Server.isStarted, true, "Rot-13 service should be started");
		});

		it("uses ports provided on command line", async () => {
			const { wwwServer, rot13Server } = await startAsync({ args: [ "5001", "5002" ]});

			assert.equal(wwwServer.port, 5001, "www port");
			assert.equal(rot13Server.port, 5002, "ROT-13 port");
		});

	});


	describe("error handling", () => {

		it("writes usage to stderr when wrong number of arguments provided", async () => {
			const { stderr } = await startAsync({ args: [] });
			assert.deepEqual(stderr, [ AllServers.USAGE + "\n"]);
		});

		it("writes error if ports aren't numbers", async () => {
			const { stderr: wwwStderr } = await startAsync({ args: [ "xxx", "1000" ]});
			const { stderr: rot13Stderr } = await startAsync({ args: [ "1000", "xxx" ]});

			assert.deepEqual(wwwStderr, [ "www server port is not a number\n" ]);
			assert.deepEqual(rot13Stderr, [ "ROT-13 server port is not a number\n" ]);
		});

	});

});

async function startAsync({
	args = VALID_ARGS,
} = {}) {
	ensure.signature(arguments, [[ undefined, {
		args: [ undefined, Array ],
	}]]);

	const commandLine = CommandLine.createNull({ args });
	const stderr = commandLine.trackStderr();

	const wwwServer = WwwServer.createNull();
	const rot13Server = Rot13Server.createNull();
	const servers = new AllServers(commandLine, wwwServer, rot13Server);

	await servers.startAsync();
	return {
		wwwServer,
		rot13Server,
		stderr,
	};
}

// function run({ args, rot13Response, rot13Error, rot13Hang }) {
// 	const commandLine = CommandLine.createNull({ args });
// 	const stdout = commandLine.trackStdout();
// 	const stderr = commandLine.trackStderr();
//
// 	const rot13Client = Rot13Client.createNull([{ response: rot13Response, error: rot13Error, hang: rot13Hang }]);
// 	const rot13Requests = rot13Client.trackRequests();
//
// 	const clock = Clock.createNull();
//
// 	const runPromise = server.runAsync({ commandLine, rot13Client, clock });
//
// 	return { runPromise, stdout, stderr, rot13Requests, clock };
// }




// describe("ROT-13 CLI", () => {
//
// 	it("calls ROT-13 service", async () => {
// 		const { rot13Requests, clock, stdout } = await runAsync({
// 			args: VALID_ARGS,
// 			rot13Response: "transformed text",
// 		});
//
// 		assert.deepEqual(rot13Requests, [{
// 			port: VALID_PORT,
// 			text: VALID_TEXT,
// 		}]);
// 		assert.deepEqual(stdout, [ "transformed text\n" ]);
//
// 		await clock.advanceNullTimersAsync();
// 		assert.equal(clock.now(), 0);
// 	});
//
// 	it("outputs an error when ROT-13 service fails", async () => {
// 		const { stderr } = await runAsync({
// 			args: VALID_ARGS,
// 			rot13Error: "my error",
// 		});
//
// 		assert.equal(stderr[0], "ROT-13 service failed:\n");
// 		assert.match(stderr[1], /my error/);
// 	});
//
// 	it("times out ROT-13 service when service responds too slowly", async () => {
// 		const { runPromise, rot13Requests, clock, stderr } = run({
// 			args: VALID_ARGS,
// 			rot13Hang: true,
// 		});
//
// 		await clock.advanceNullAsync(TIMEOUT_IN_MS);
// 		await assert.promiseResolvesAsync(runPromise);
// 		assert.deepEqual(rot13Requests, [
// 			{
// 				port: VALID_PORT,
// 				text: VALID_TEXT,
// 			},
// 			{
// 				port: VALID_PORT,
// 				text: VALID_TEXT,
// 				cancelled: true,
// 			},
// 		]);
// 		assert.deepEqual(stderr, [
// 			"ROT-13 service failed:\n",
// 			"Service timed out.\n",
// 		]);
// 	});
//
// 	it("writes usage to command-line when arguments not provided", async () => {
// 		const { stderr } = await runAsync({ args: [] });
// 		assert.deepEqual(stderr, [ "Usage: run PORT TEXT\n" ]);
// 	});
//
// });
//
// async function runAsync(options) {
// 	const results = run(options);
// 	await results.runPromise;
// 	return results;
// }
//
// function run({ args, rot13Response, rot13Error, rot13Hang }) {
// 	const commandLine = CommandLine.createNull({ args });
// 	const stdout = commandLine.trackStdout();
// 	const stderr = commandLine.trackStderr();
//
// 	const rot13Client = Rot13Client.createNull([{ response: rot13Response, error: rot13Error, hang: rot13Hang }]);
// 	const rot13Requests = rot13Client.trackRequests();
//
// 	const clock = Clock.createNull();
//
// 	const runPromise = server.runAsync({ commandLine, rot13Client, clock });
//
// 	return { runPromise, stdout, stderr, rot13Requests, clock };
// }