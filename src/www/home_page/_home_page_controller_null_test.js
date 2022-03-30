// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("util/assert");
const ensure = require("util/ensure");
const HttpRequest = require("http/http_request");
const WwwConfig = require("../www_config");
const homePageView = require("./home_page_view");
const Rot13Client = require("../infrastructure/rot13_client");
const HomePageController = require("./home_page_controller");
const Log = require("infrastructure/log");
const Clock = require("infrastructure/clock");

const IRRELEVANT_PORT = 42;
const IRRELEVANT_INPUT = "irrelevant_input";

describe.only("Home Page Controller", () => {

	describe("happy paths", () => {

		it("GET renders home page", async () => {
			/* CHALLENGE #1: Using nullable infrastructure
			 *
			 * We're going to start off nice and easy.
			 *
			 * Hints:
			 *
			 * 1. Your test will need a HomePageController. You can construct it with HomePageController.createNull().
			 *
			 * 2. Your test will need to simulate a GET request. You can do that by calling controller.getAsync(). Don't
			 * forget to 'await' it.
			 *
			 * 3. getAsync() expects a 'HttpRequest' object and a 'WwwConfig' object. (The router passes these two
			 * parameters to every controller method.) Both of them can be instantiated by calling their createNull()
			 * static methods. E.g., HttpRequest.createNull() and WwwConfig.createNull().
			 *
			 * 4. The server expects all controller methods to return an HttpResponse. Functions to create the HttpResponse
			 * are in HomePageView. There's only one function in there: homePageView.homePage(). It returns the home page.
			 *
			 * 5. You'll need an 'expected' value to compare against the results of getAsync(). You can use
			 * homePageView.homePage() as your expected value.
			 *
			 * 6. Use assert.deepEqual() to make the comparison. It checks that the contents of two objects are identical.
			 *
			 */

			// Arrange: set up HomePageController, HttpRequest, and WwwConfig

			// Act: call controller.getAsync() -- don't forget to await

			// Assert: check that the result of getAsync() matches homePageView.homePage()

		});

		it("POST asks ROT-13 service to transform text", async () => {
			/* CHALLENGE #2: Tracking output
			 *
			 * This is a lot more challenging! There's three parts to this challenge. Be sure to take it in small steps.
			 *   a. Calling the ROT-13 service with hard-coded data
			 *   b. Calling the ROT-13 service with the correct port
			 *   c. Parsing the form data and calling the ROT-13 service with the correct text
			 *
			 * Hints:
			 *
			 * 1. Your production code will need to call the ROT-13 service. The way it does so is with Rot13Client.
			 * When you called HomePageController.createNull() in the last challenge, it created the Rot13Client for you.
			 * But in this challenge, your test will need to call methods on Rot13Client, so you'll need to create the
			 * Rot13Client manually and pass it into HomePageController.createNull(). The way to do so is with an optional
			 * parameter: HomePageController.createNull({ rot13Client }).
			 *
			 * 2. Rot13Client can be created with .createNull() just like everything else.
			 *
			 * 3. You need to see which requests have been made to the ROT-13 service. You can track requests by calling
			 * rot13Client.trackRequests(). It returns an array that is updated every time a new request is made. Note that
			 * you have to call trackRequests() *before* making the request.
			 *
			 * 4. Compare the results of trackRequests() to your expected requests using assert.deepEqual(). Note that
			 * trackRequests() will return an array of objects. Each object represents a single request. For example:
			 *   assert.deepEqual(rot13Requests, [{
			 *     port: 123,           // The port of the ROT-13 service
			 *     text: "some text",   // The text sent to the service
			 *   }]);
			 *
			 * 5. Once you have a simple test written, you can call the ROT-13 service in your production code by calling
			 * this._rot13Client.transform(port, text). "Port" is the port that the ROT-13 server is running on.
			 * "Text" is the text you want to transform. Start by hardcoding both of them. Don't worry about the return
			 * value... that's for the next challenge.
			 *
			 * 6. Once the test is passing, change it to use the real ROT-13 port. The port is provided by WwwConfig,
			 * specifically config.rot13ServicePort. Your test will need to set it up by passing the port into createNull().
			 * As with all createNull() factories, it uses an optional parameter: WwwConfig.createNull({ rot13ServicePort }).
			 *
			 * 7. After you get the port working, you'll need to use the real text. That comes from user's input on the web
			 * page. Specifically, the web browser will send a request body with URL-encoded form data. It will look like
			 * this: "text=hello%20world".
			 *
			 * 8. In your test, you can set up the request body by using--you guessed it--HttpRequest.createNull({ body }).
			 *
			 * 9. In your production code, you can read the request body by using "await request.readBodyAsync()".
			 *
			 * 10. To parse the form data, use the standard "URLSearchParams" class. It works like this:
			 *   const formData = new URLSearchParams(requestBody);   // parse the request body
			 *   const textFields = formData.getAll("text");  // get an array containing the value of all "text" fields
			 *   const userInput = textFields[0];
			 *
			 * 11. Don't worry about parsing errors or edge cases. That's for a later challenge.
			 *
			 */

			// Arrange: set up HomePageController, HttpRequest, WwwConfig, Rot13Client, and Rot13Client.trackRequests() --
			// don't forget to pass Rot13Client into HomePageController

			// Act: call controller.postAsync() -- don't forget to await

			// Assert: check the Rot13Client requests -- remember to call trackRequests() before calling postAsync()
			// If you don't see any requests, make sure you've passed rot13Client into HomePageController.createNull()
		});

		it("POST renders result of ROT-13 service call", async() => {
			/* CHALLENGE #3: Configuring responses
			 *
			 * This should be easier. It's similar to the last challenge, except this time we're dealing with the
			 * response from the ROT-13 service, rather than checking that we're calling the ROT-13 service correctly.
			 *
			 * Hints:
			 *
			 * 1. Just like in the last challenge, you'll need a Rot13Client.
			 *
			 * 2. But this time, you'll need to control what data the Rot13Client returns. You can do that by providing
			 * an array of objects, like this:
			 *    Rot13Client.createNull([{ response: "my_response" }]);
			 * That tells the Rot13Client to respond with "my_response" the first time it's called. (If you wanted to
			 * control additional responses, you can add more objects to the array.)
			 *
			 * 3. In your test's assertion, you'll need to check that postAsync returns the correct HttpResponse. It's just
			 * like the GET test, except you want to render the response into the page. You can do that by calling
			 * homePageView.homePage("my_response").
			 *
			 * 3. In the production code, you'll need to get the response from Rot13Client. It returns an object with a
			 * transformPromise, like this:
			 *    const { transformPromise } = this._rot13Client.transform(port, text);
			 *
			 * 4. You'll need to await the transformPromise to get the transformed text. Like this:
			 *    const output = await transformPromise;
			 *
			 * 5. Once you have the output, you'll need to render the HttpResponse, just like for the GET challenge.
			 *
			 * 6. Don't worry about errors or edge cases. That's for a later challenge.
			 *
			 * 7. Once this tests pass, the code should work. Run "serve_dev 5010 5011" from the command-line and try
			 * accessing the page in a web browser: http://localhost:5010
			 *
			 */

			// Arrange: set up HomePageController, HttpRequest, WwwConfig, and Rot13Client -- don't forget to pass
			// Rot13Client into HomePageController

			// Act: call controller.postAsync() -- don't forget to await
			// If you get an error from rot13Client.transform, make sure you're setting up the request body correctly

			// Assert: check that the result of postAsync() matches homePageView.homePage(expectedText)
		});

	});


	describe("parse edge cases", () => {

		it("finds correct form field when there are unrelated fields", async () => {
			/* CHALLENGE #4: A minor tweak
			 *
			 * This is the same kind of test as challenge #2. Confirm that this request body works:
			 *    const body = "unrelated=one&text=two&also_unrelated=three";
			 *
			 * Hints:
			 *
			 * 1. You can use essentially the same test code as challenge #2, just with a different request body. Depending
			 * on how you implemented challenge #2, the production code may work as-is.
			 *
			 * 2. Start thinking about how to factor out duplication, but don't implement it yet.
			 *
			 * 3. Instead of using beforeEach(), consider a helper method instead, such as "simulatePostAsync()". But
			 * don't implement anything yet.
			 */

			// Your test here.
		});

		it("logs warning when form field not found (and treats request like GET)", async () => {
			/* CHALLENGE #5: Logging
			 *
			 * This is similar to challenge #2, except that you're looking at log output rather than ROT-13 service requests.
			 * Use an empty request body.
			 *
			 * Hints:
			 *
			 * 1. Your test needs a Log instance and to track log output. The methods you're looking for are Log.createNull()
			 * and log.trackOutput(). trackOutput() works just like trackRequests(), in that it populates an array of
			 * objects. For example:
			 *    assert.deepEqual(logOutput, [{
			 *      alert: "monitor",
			 *      message: "form parse error in POST /",
			 *      details: "'text' form field not found",
			 *      body: "",
			 *    });
			 *
			 * 2. Your production code will get the log from the config object. Be sure to set up your config with your null
			 * log, like this: Config.createNull({ log })
			 *
			 * 3. In your production code, you can log a warning by calling log.monitor() with an object. The logger will
			 * automatically populate the "alert" field, and will use the object you provide to populate the other fields.
			 * (In production, the fields are converted to JSON and output to the console.)
			 *
			 * 4. Once you have the logging working, be sure to assert that the controller returns the home page. (This is
			 * similar to challenge #1.)
			 */

			// Your test here.
		});

		it("logs warning when duplicated form field found (and treats request like GET)", async () => {
			/* CHALLENGE #6: Refactoring
			 *
			 * Before writing this test, look at your existing tests. There's probably a lot of duplication. Think about
			 * how to refactor it to eliminate the duplication. Then, after the test is working, look at your production
			 * code and find ways to clean it up.
			 *
			 * Use this request body:
			 *    const body = "text=one&text=two";
			 *
			 * Hints:
			 *
			 * 1. I used a "simulatePostAsync()" method with optional parameters and multiple optional return values,
			 * like this:
			 *    const { response, rot13Requests, logOutput } = simulatePostAsync({ body, rot13Client, rot13Port });
			 *
			 */

			// Your test here.
		});

	});


	describe.skip("ROT-13 service edge cases", () => {

		it("fails gracefully, and logs error, when service returns error", async () => {
			const rot13Client = Rot13Client.createNull([{ error: "my_error" }]);
			const { response, logOutput } = await simulatePostAsync({ rot13Client, rot13Port: 9999 });

			assert.deepEqual(response, homePageView.homePage("ROT-13 service failed"));
			assert.deepEqual(logOutput, [{
				alert: Log.EMERGENCY,
				message: "ROT-13 service error in POST /",
				error: "Error: " + Rot13Client.nullErrorString(9999, "my_error"),
			}]);
		});

		it("fails gracefully, cancels request, and logs error, when service responds too slowly", async () => {
			const rot13Client = Rot13Client.createNull([{ hang: true }]);
			const { responsePromise, rot13Requests, logOutput, clock } = simulatePost({
				rot13Client,
			});

			await clock.advanceNullTimersAsync();
			const response = await responsePromise;

			assert.deepEqual(response, homePageView.homePage("ROT-13 service timed out"), "graceful failure");
			assert.deepEqual(rot13Requests, [{
				port: IRRELEVANT_PORT,
				text: IRRELEVANT_INPUT,
			}, {
				cancelled: true,
				port:  IRRELEVANT_PORT,
				text: IRRELEVANT_INPUT,
			}]);
			assert.deepEqual(logOutput, [{
				alert: Log.EMERGENCY,
				message: "ROT-13 service timed out in POST /",
				timeoutInMs: 5000,
			}]);
		});

	});

});

async function simulateGetAsync() {
	ensure.signature(arguments, []);

	const controller = HomePageController.createNull();
	const response = await controller.getAsync(HttpRequest.createNull(), WwwConfig.createNull());

	return { response };
}

async function simulatePostAsync(options) {
	const { responsePromise, ...remainder } = simulatePost(options);

	return {
		response: await responsePromise,
		...remainder,
	};
}

function simulatePost({
	body = `text=${IRRELEVANT_INPUT}`,
	rot13Client = Rot13Client.createNull(),
	rot13Port = IRRELEVANT_PORT,
} = {}) {
	ensure.signature(arguments, [[ undefined, {
		body: [ undefined, String ],
		rot13Client: [ undefined, Rot13Client ],
		rot13Port: [ undefined, Number ]
	}]]);

	const rot13Requests = rot13Client.trackRequests();
	const clock = Clock.createNull();
	const request = HttpRequest.createNull({ body });
	const log = Log.createNull();
	const logOutput = log.trackOutput();
	const config = WwwConfig.createNull({ rot13ServicePort: rot13Port, log });

	const controller = HomePageController.createNull({ rot13Client, clock });
	const responsePromise = controller.postAsync(request, config);

	return {
		responsePromise,
		rot13Requests,
		logOutput,
		clock,
	};
}
