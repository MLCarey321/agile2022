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

describe.only("Home Page Controller", () => {

	describe("happy paths", () => {

		it("GET renders home page", async () => {
			/* CHALLENGE #1: Using nullable infrastructure
			 *
			 * We're going to start off nice and easy. For this first challenge, all you need to do is make the
			 * HomePageController return the home page when it receives a GET request.
			 *
			 * Useful methods:
			 *
			 * 1. const controller = HomePageController.createNull() - create a HomePageController
			 * 2. const request = HttpRequest.createNull() - create an HttpRequest
			 * 3. const config = WwwConfig.createNull() - create a WwwConfig
			 * 4. const response = await controller.getAsync(request, config) - handles the GET request
			 * 5. const response = homePageView.homePage() - render the home page
			 * 5. assert.deepEqual(actual, expected) - compare two objects
			 *
			 * Hints:
			 *
			 * 1. Your test will need a HomePageController. You can construct it with HomePageController.createNull():
			 *    const controller = HomePageController.createNull();
			 *
			 * 2. Your test will need to simulate a GET request. You can do that by calling controller.getAsync(). Don't
			 * forget to 'await' it.
			 *
			 * 3. getAsync() expects a 'HttpRequest' object and a 'WwwConfig' object. (The router passes these two
			 * parameters to every controller method.) Both of them can be instantiated by calling their createNull()
			 * static methods:
			 *    const request = HttpRequest.createNull();
			 *    const config = WwwConfig.createNull();
			 *    const response = await controller.getAsync(request, config);
			 *
			 * 4. You'll need an 'expected' value to compare against the results of getAsync(). You can use
			 * homePageView.homePage() as your expected value.
			 *    const expected = homePageView.homePage();
			 *
			 * 5. Use assert.deepEqual() to make the comparison. It checks that the contents of two objects are identical.
			 *    assert.deepEqual(response, expected);
			 *
			 * 6. The test is complete. When you save, it will fail with "unexpected undefined to deep equal HttpResponse..."
			 * This means getAsync() isn't returning a value.
			 *
			 * 7. Make the test pass by having getAsync() return the home page:
			 *    return homePageView.homePage()
			 */

			// Arrange: set up HomePageController, HttpRequest, and WwwConfig
			const controller = HomePageController.createNull();
			const request = HttpRequest.createNull();
			const config = WwwConfig.createNull();

			// Act: call controller.getAsync() -- don't forget to await (It's not strictly necessary in this case, but
			// get into the habit of using "await" on Async() methods.)
			const response = await controller.getAsync(request, config);

			// Assert: check that the result of getAsync() matches homePageView.homePage()
			const expected = homePageView.homePage();
			assert.deepEqual(response, expected);
		});

		it("POST asks ROT-13 service to transform text", async () => {
			/* CHALLENGE #2: Tracking requests
			 *
			 * This is a lot more challenging! You need to make HomePageController respond to POST requests. When it receives
			 * the request, it needs to parse the form data and call the ROT-13 service. (You don't need to worry about
			 * returning the home page for this challenge.)
			 *
			 * To make this challenge easier, take it in small steps. Be sure to test-drive each step.
			 *   a. TCall the ROT-13 service with a hard-coded port and text
			 *   b. Call the ROT-13 service with the correct port
			 *   c. Parse the form data and call the ROT-13 service with the correct text
			 *
			 * Don't worry about parsing errors or edge cases for this challenge.
			 *
			 * Hints:
			 *
			 * PART (a)
			 *
			 * 1. Your production code will need to call the ROT-13 service. The way to do so is with Rot13Client, which
			 * is in "this._rot13Client".
			 *
			 * 2. When you called HomePageController.createNull() in the last challenge, it created the Rot13Client for you.
			 * But in this challenge, you’ll need access to the Rot13Client instance in your test, so you'll need to create
			 * it in your test and pass it into HomePageController. The way to do so is with an optional
			 * parameter: HomePageController.createNull({ rot13Client }).
			 *
			 * 3. To create Rot13Client, you can call Rot13Client.createNull().
			 *
			 * 4. Your test needs to see which requests have been made to the ROT-13 service. You can do that by calling
			 * rot13Client.trackRequests(). It returns an array that is updated every time a new request is made. Note that
			 * you have to call trackRequests() BEFORE making the request.
			 *
			 * 5. Compare the results of trackRequests() to your expected requests using assert.deepEqual(). Note that
			 * trackRequests() will return an array of objects. Each object represents a single request. For example:
			 *   assert.deepEqual(rot13Requests, [{
			 *     port: 123,           // The port of the ROT-13 service
			 *     text: "some text",   // The text sent to the service
			 *   }]);
			 *
			 * 6. Once you have a simple test written, you can call the ROT-13 service in your production code by calling
			 * this._rot13Client.transform(port, text). "Port" is the port that the ROT-13 server is running on.
			 * "Text" is the text you want to transform. Start by hardcoding both of them. You don't need to worry about
			 * the return value for this challenge.
			 *
			 * PART (b)
			 *
			 * 7. Once the test is passing, change it to use the real ROT-13 port. The port is provided by WwwConfig,
			 * specifically config.rot13ServicePort. Your test will need to set it up by passing the port into
			 * WwwConfig.createNull(). As with all createNull() factories, it uses an optional parameter. Like this:
			 *    WwwConfig.createNull({ rot13ServicePort }).
			 *
			 * PART (c)
			 *
			 * 8. After you get the port working, you'll need to use the real text. That comes from user's input on the web
			 * page. Specifically, the web browser will send a request body with URL-encoded form data. It will look like
			 * this: "text=hello%20world".
			 *
			 * 9. In your test, you can set up the request body by using--you guessed it--HttpRequest.createNull({ body }).
			 *
			 * 10. In your production code, you can read the request body by using "await request.readBodyAsync()".
			 *
			 * 11. To parse the form data, use the standard "URLSearchParams" class. It works like this:
			 *   const formData = new URLSearchParams(requestBody);   // parse the request body
			 *   const textFields = formData.getAll("text");  // get an array containing the value of all "text" fields
			 *   const userInput = textFields[0];
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
			 * This should be easier. It's a continuation of the last challenge. In the last challenge, you made the code
			 * call the ROT-13 server. In this challenge, you need to make it return the correct home page response.
			 * Specifically, the controller should return a web page with the translated ROT-13 string in the text field.
			 *
			 * Don't worry about server errors or edge cases for this challenge.
			 *
			 * When this challenge is complete, the code should work end to end. Check it manually as follows:
			 *    1. Run `serve_dev 5010 5011` (Windows) or `./serve_dev.sh 5010 5011` (Mac/Linux) from the command line
			 *    2. Access the page in a web browser: http://localhost:5010
			 *
			 * Hints:
			 *
			 * 1. Just like in the last challenge, you'll need a Rot13Client.
			 *
			 * 2. But this time, you'll need to control what data the Rot13Client returns. You can do that by providing
			 * an array of objects, like this:
			 *    Rot13Client.createNull([{ response: "my_response" }]);
			 *
			 * That tells the Rot13Client to respond with "my_response" the first time it's called. (If you wanted to
			 * control additional responses, you can add more objects to the array.)
			 *
			 * 3. In your test's assertion, you'll need to check that postAsync returns the correct HttpResponse. It's just
			 * like challenge #1, except you want to render the response into the page. You can do that by calling
			 * homePageView.homePage("my_response").
			 *
			 * 4. In the production code, you'll need to get the response from Rot13Client. It returns an object with a
			 * transformPromise, like this:
			 *    const { transformPromise } = this._rot13Client.transform(port, text);
			 *
			 * 5. You'll need to await the transformPromise to get the transformed text. Like this:
			 *    const output = await transformPromise;
			 *
			 * 6. Once you have the output, you'll need to render the HttpResponse, just like for the GET challenge.
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
			 * 2. Start thinking about how to factor out duplication, but don't implement it yet. Instead of using
			 * beforeEach(), consider a helper method instead, such as "simulatePostAsync()". But don't refactor just yet.
			 */

			// Your test here.
		});

		it("logs warning when form field not found (and treats request like GET)", async () => {
			/* CHALLENGE #5: Logging
			 *
			 * This is also similar to challenge #2, except now you need to handle a missing form field and log a warning.
			 * Use an empty request body in your test and confirm that the controller outputs a log message and returns
			 * the home page.
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
			 * This is similar to the last challenge, in that you need to handle bad form data and log a warning. Use
			 * this request body: "text=one&text=two"
			 *
			 * Before writing this test, look at your existing tests. There's probably a lot of duplication. Think about
			 * how to refactor it to eliminate the duplication. Then, after the test is working, look at your production
			 * code and find ways to clean it up.
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


	describe("ROT-13 service edge cases", () => {

		it("fails gracefully, and logs error, when service returns error", async () => {
			/* CHALLENGE #7: Service errors
			 *
			 * Make sure the code handles errors in the ROT-13 service gracefully. Log the error and return the home
			 * page with "ROT-13 service failed" in the text field.
			 *
			 * Hints:
			 *
			 * 1. This is very similar to challenge #3, except you need to force the Rot13Client to have an error.
			 * You can do that by passing an "error" property to Rot13Client, rather than a "response" property, like this:
			 *    const rot13Client = Rot13Client.createNull([{ error: "my_error" }]);
			 *
			 * 2. When the Rot13Client encounters an error, it will throw an exception. Your production code will need to
			 * catch the exception and log the error. You can use "log.emergency()" to do so.
			 *
			 * 3. Don't forget to check that the controller returns the correct home page. You don't need to do anything
			 * fancy; just put the error in the text field, like this:
			 *    return homePageView.homePage("ROT-13 service failed");
			 *
			 */

			// Your test here.
		});

		it("fails gracefully, cancels request, and logs error, when service responds too slowly", async () => {
			/* CHALLENGE #8: Timeouts
			 *
			 * The final challenge! This is a tough one. Make the code handle timeouts in the ROT-13 service. Log the
			 * error, cancel the request, and return the home page with "ROT-13 service timed out" in the text field.
			 *
			 * To make this challenge easier, take it in small steps. Be sure to test-drive each step.
			 *   a. Log the error and return the home page
			 *   b. Cancel the request
			 *
			 * If you finish this challenge and still have time remaining, come up with your own challenges. One option is
			 * to make the error handling more sophisticated, possibly with a customized response. You can do that by
			 * adding a new function to HomePageView.
			 *
			 * Hints:
			 *
			 * PART (a)
			 *
			 * 1. Forcing the ROT-13 service to hang is just like forcing it to have an error. Pass a "hang" property, like
			 * this:
			 *    const rot13Client = Rot13Client.createNull([{ hang: true }]);
			 *
			 * 2. You can use the Clock object to implement timeouts. Be sure to construct a null Clock in your test and
			 * pass it into HomePageController.createNull(). Then, after calling postAsync(), call advanceNullTimersAsync()
			 * to automatically advance the clock past the timeout.
			 *
			 * 3. Because you have to call advanceNullTimersAsync AFTER calling postAsync(), you can't "await" the result
			 * of postAsync() in your test. If you do, the call to advanceNullTimersAsync() will never execute. Instead, you
			 * have to store the promise, advance the clock, and then await the promise. Like this:
			 *    const responsePromise = controller.postAsync(request, config);
			 *    await clock.advanceNullTimersAsync();
			 *    const response = await responsePromise;
			 *
			 * 4. In your production code, use Clock.timeoutAsync() to implement the timeout, like this:
			 *    const output = await this._clock.timeoutAsync(timeoutInMs, transformPromise, timeoutFn);
			 *
			 * "timeoutInMs" is the number of milliseconds to wait before timing out.
			 * "transformPromise" is the promise to wait for (in this case, the output of Rot13Client.transform)
			 * "timeoutFn" is the function to call if the promise times out.
			 *
			 * PART (b)
			 *
			 * 5. In your tests, to check if the request was cancelled, you'll need to track requests like in
			 * challenge #2. Cancellations are appended to the request array. A request followed by a cancellation
			 * looks like this:
			 *    assert.deepEqual(rot13Requests, [{
			 *      port: 9999,
			 *      text: "my_input",
			 *    }, {
			 *      port: 9999,
			 *      text: "my_input",
			 *      cancelled: true,
			 *    }]);
			 *
			 * 6. In your production code, you can cancel a request by using the "cancelFn" variable returned by
			 * rot13Client.transform(). Like this:
			 *    const { transformPromise, cancelFn } = rot13Client.transform(port, text);
			 *    ...
			 *    cancelFn();   // cancels the request
			 *
			 * 7. After everything is working, be sure to look for opportunities to refactor the tests and production code.
			 *
			 */

			// Your test here.
		});

	});

});
