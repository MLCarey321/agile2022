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
const td = require("testdouble");

describe.only("Home Page Controller", () => {

	afterEach(() => {
		td.reset();
	});

	describe("happy paths", () => {

		it("GET renders home page", async () => {
			/* CHALLENGE #1: Using nullable infrastructure
			 *
			 * We're going to start off nice and easy. For this first challenge, all you need to do is replace the
			 * test's mock instances with null instances. Specifically:
			 *
			 *    1. Replace calls to td.instance() with calls to createNull().
			 *
			 * Useful methods:
			 *
			 * 1. const rot13Client = Rot13Client.createNull() - create a Rot13Client.
			 * 2. const clock = Clock.createNull() - create a Clock.
			 * 3. const controller = HomePageController.createNull() - create a HomePageController.
			 * 4. const request = HttpRequest.createNull() - create an HttpRequest.
			 * 5. const config = WwwConfig.createNull() - create a WwwConfig.
			 *
			 * Hints:
			 *
			 * 1. Each call to "td.instance(Class)" can be replaced with a corresponding call to Class.createNull(). For
			 * example, replace
			 *    const rot13Client = td.instance(Rot13Client);
			 * with
			 *    const rot13Client = Rot13Client.createNull();
			 *
			 * 2. Run the tests. They should still pass.
			 *
			 * 3. Repeat for each following line, running the tests after each one.
			 *    const clock = Clock.createNull();
			 *    const request = HttpRequest.createNull();
			 *    const config = WwwConfig.createNull();
			 *
			 */

			// Arrange: set up HomePageController, HttpRequest, and WwwConfig
			const rot13Client = td.instance(Rot13Client);
			const clock = td.instance(Clock);
			const request = td.instance(HttpRequest);
			const config = td.instance(WwwConfig);
			const controller = new HomePageController(rot13Client, clock);

			// Act: call controller.getAsync() -- don't forget to await (It's not strictly necessary in this case, but
			// get into the habit of using "await" on Async() methods.)
			const response = await controller.getAsync(request, config);

			// Assert: check that the result of getAsync() matches homePageView.homePage()
			const expected = homePageView.homePage();
			assert.deepEqual(response, expected);
		});

		it("POST asks ROT-13 service to transform text", async () => {
			/* CHALLENGE #2a: Configuring nulls
			 *
			 * This is a lot more challenging! The mock-based version of this test overrides return values and
			 * makes assertions about how a function was called. To make this easier, the challenge is broken into two
			 * parts.
			 *
			 * For part (a), replace the mock code that overrides return values, but leave the assertions unchanged.
			 * Specifically:
			 *
			 *    1. Replace calls to td.instance() with calls to createNull(), EXCEPT for the rot13Client.
			 *    2. Remove the code under the "Configuration code" comment by configuring the null instances directly.
			 *    3. DO NOT change the assertion code at this time.
			 *
			 *
			 * Useful methods:
			 *
			 * 1. const config = WwwConfig.createNull({ rot13ServicePort: 999 })
			 *      Create a WwwConfig with the provided ROT-13 service port. Note that the parameter is an object
			 *      with an optional field named "rot13ServicePort".
			 * 2. const request = HttpRequest.createNull({ body: "text=hello%20world" })
			 *      Create a request with the provided body. Note that the parameter is an object with an optional
			 *      field named "body".
			 *
			 *
			 * JavaScript syntax notes:
			 *
 			 * 1. Optional fields and parameters:
 			 * It's common for JavaScript functions to take an object as a parameter. The function will expect the object
 			 * to have certain fields. Often, those fields are optional. If no value is provided, the function will fill
 			 * in a default. In fact, the whole parameter can be optional. For example, the following code will print
 			 * "foo" twice, then "bar".
 			 *      static myFunction({ text = "foo" } = {}) {
 			 *        console.log(text);
 			 *      }
 			 *      myFunction();                     // prints "foo"
 			 *      myFunction({});                   // prints "foo"
 			 *      myFunction({ text: "bar" });      // prints "bar"
			 *
			 *
			 * Hints:
			 *
			 * 1. Start by replacing the "td.instance()" code again, one line at a time. You're supposed to skip the
			 * "rot13Client" line for this test, so start by replacing the "clock" line:
			 *    const clock = Clock.createNull();
			 *
			 * 2. Run the tests. They should pass.
			 *
			 * 3. Next, replace the "request" line:
			 *    const request = HttpRequest.createNull();
			 *
			 * 4. This time, when you run the tests, they'll fail with an "unsatisfied verification" error. This is
			 * a confusing error message, but it's occurring because the "td.when()" line isn't able to set up the
			 * return value. Instead, you need to configure the request, like this:
			 *    const request = HttpRequest.createNull({ body: "text=hello%20world" });
			 *
			 * 5. Now the tests should pass.
			 *
			 * 6. The call to td.when() is redundant, so you can delete it. The tests should continue to pass.
			 *
			 * 7. Now replace the "config" line:
			 *    const config = WwwConfig.createNull();
			 *
			 * 8. When you run the tests, they'll fail with "cannot set property rot13ServicePort of #<WwwConfig>". That's
			 * because you're using a production WwwConfig instance now, and the production code doesn't allow
			 * rot13ServicePort to be set. Instead, configure the port when you create the null instance, like this:
			 *    const config = WwwConfig.createNull({ rot13ServicePort: 999});
			 *
			 * 9. Delete the "config.rot13ServicePort = 999" line. The test should now pass. That completes the challenge.
			 *
			 */

			// Arrange: set up HomePageController, HttpRequest, WwwConfig, Rot13Client, and Rot13Client.trackRequests() --
			// don't forget to pass Rot13Client into HomePageController
			const rot13Client = td.instance(Rot13Client);
			const clock = Clock.createNull();
			const request = HttpRequest.createNull({ body: "text=hello%20world" });
			const config = WwwConfig.createNull({ rot13ServicePort: 999});
			const controller = new HomePageController(rot13Client, clock);

			// Act: call controller.postAsync() -- don't forget to await
			await controller.postAsync(request, config);

			// Assert: check the Rot13Client requests -- remember to call trackRequests() before calling postAsync()
			td.verify(rot13Client.transformAsync(999, "hello world"));


			// // Arrange: set up HomePageController, HttpRequest, WwwConfig, Rot13Client, and Rot13Client.trackRequests() --
			// // don't forget to pass Rot13Client into HomePageController
			// const rot13Client = td.instance(Rot13Client);
			// const clock = td.instance(Clock);
			// const request = td.instance(HttpRequest);
			// const config = td.instance(WwwConfig);
			// const controller = new HomePageController(rot13Client, clock);
			//
			// // Configuration code. Remove these lines by configuring the null instances instead.
			// config.rot13ServicePort = 999;
			// td.when(request.readBodyAsync()).thenResolve("text=hello%20world");
			//
			// // Act: call controller.postAsync() -- don't forget to await
			// await controller.postAsync(request, config);
			//
			// // Assert: check the Rot13Client requests -- remember to call trackRequests() before calling postAsync()
			// td.verify(rot13Client.transformAsync(999, "hello world"));
		});

		/* CHALLENGE #2b: Dynamic port
		 *
		 * For this challenge, modify the test and production code created in Challenge #2a. Change it to use the
		 * ROT-13 service port provided in WwwConfig rather than hard-coding the value.
		 *
		 * Useful methods:
		 *
		 * 1. const config = WwwConfig.createNull({ rot13ServicePort }) - create a WwwConfig with the provided ROT-13
		 *      service port. Note that the parameter is an object with an optional field named "rot13ServicePort".
		 * 2. const port = config.rot13ServicePort - get the ROT-13 service port.
			 * 3. const rot13Requests = rot13Client.trackRequests() - track requests made by rot13Client. This returns a
			 *      reference to an empty array on the heap. Every time rot13Client makes a request to the ROT-13 service,
			 *      an object describing the request is appended to the array. The object looks like this:
			 *          {
			 *            port: 123,          // The port of the ROT-13 service
			 *            text: "some text"   // The text sent to the service
			 *          }
		 *
		 * Hints:
		 *
		 * 1. Your production code will get the port from WwwConfig, so you'll need to update the "config" line of
		 * your test to provide the port. Use a different port to prove that your test is working:
		 *    const config = WwwConfig.createNull({ rot13ServicePort: 999 });
		 *
		 * 2. Remember to update your assertion to use the new port:
		 *    assert.deepEqual(rot13Requests, [{
		 *      port: 999,           // The port of the ROT-13 service
		 *      text: "some text",   // The text sent to the service
		 *    }]);
		 *
		 * 3. When you run the test, it will fail because it expected port 999, but got port 123. This means your
		 * production code isn't using the port defined in the config.
		 *
		 * 4. Change your production code to get the port out of the config object. Like this:
		 *    await this._rot13Client.transformAsync(config.rot13ServicePort, "some text");
		 *
		 */

		/* CHALLENGE #2c: Parsing the request body
		 *
		 * Modify the test and production code created in Challenge #2a again. This time, change it to parse the request
		 * body rather than hard-coding the text. Use this request body:
		 *
		 *    const body = "text=hello%20world";
		 *
		 * This is URL-encoded form data that matches what a browser will send. Given this body, the controller should
		 * parse out the "text" field and send "hello world" to the ROT-13 service.
		 *
		 * Useful methods:
		 *
		 * 1. const request = HttpRequest.createNull({ body }) - create a request with the provided body. Note that
		 *      the parameter is an object with an optional field named "body". (To inline the body, use
		 *      "HttpRequest.createNull({ body: "text=hello%20world" })".)
		 * 2. const body = await request.readBodyAsync() - read the request body.
		 * 3. const formData = new URLSearchParams(body) - parse the request body. (URLSearchParams is part of the
		 *      standard library.)
		 * 4. const textFields = formData.getAll("text") - get an array containing the values of all "text" fields. The
		 *      array will be empty if there are no "text" fields.
		 *
		 * Hints:
		 *
		 * 1. Your production code will read the request body from HttpRequest, so you need to update the "request" line
		 * of your test to provide the body. Like this:
		 *    const body = "text=hello%20world";
		 *    const request = HttpRequest.createNull({ body });
		 *
		 * 2. Update your assertion to use the new text field:
		 *    assert.deepEqual(rot13Requests, [{
		 *      port: 999,           // The port of the ROT-13 service
		 *      text: "hello world", // The text sent to the service
		 *    }]);
		 *
		 * 3. When you run the test, it will fail because it expected "hello world," but got "some text". This means
		 * your production code isn't reading the request body.
		 *
		 * 4. Change your production code to read the request body:
		 *    const body = await request.readBodyAsync();
		 *
		 * 5. Parse the request body:
		 *    const formData = new URLSearchParams(requestBody);
		 *    const textFields = formData.getAll("text");
		 *    const userInput = textFields[0];
		 *
		 * 6. Modify the ROT-13 request to use the request body:
		 *    await this._rot13Client.transformAsync(config.rot13ServicePort, userInput);
		 *
		 */

		it("POST renders result of ROT-13 service call", async() => {
			/* CHALLENGE #3: Configuring responses
			 *
			 * In the previous challenge, you made the code call the ROT-13 server. In this challenge, you need to make it
			 * return the correct home page response. Specifically, the controller should return a web page with the
			 * translated ROT-13 string in the text field.
			 *
			 * Don't worry about server errors or edge cases for this challenge.
			 *
			 * When this challenge is complete, the code should work end to end. Check it manually as follows:
			 *    1. Run `.\serve_dev.cmd 5010 5011` (Windows) or `./serve_dev.sh 5010 5011` (Mac/Linux) on the command line
			 *    2. Access the page in a web browser: http://localhost:5010
			 *
			 * Useful methods:
			 *
			 * 1. const rot13Client = Rot13Client.createNull([{ response: "my_response" }]) - create a Rot13Client that
			 *      responds with "my_response" the first time it's called. Note that the parameter is an array of objects.
			 *      (If you wanted to control additional responses, you would add more objects to the array.)
			 * 2. const response = homePageView.homePage("my_text") - render the home page with "my_text" in the text field.
			 *
			 * Hints:
			 *
			 * 1. Just like in the last challenge, you'll need to create a Rot13Client in your test. But this time, you'll
			 * need to control what data it returns. You can do that by providing an array of objects, like this:
			 *    const rot13Client = Rot13Client.createNull([{ response: "my_response" }]);
			 *
			 * 2. You'll need a valid request body. Otherwise, your parsing logic will fail:
			 *    const request = HttpRequest.createNull({ body: "text=irrelevant_text" });
			 *
			 * (I like to use "irrelevant_xxx" for data that's required for the test to run, but not otherwise relevant
			 * to the test at hand.)
			 *
			 * 3. You'll need a controller and config, too, but you don't need to track requests or configure a specific
			 * port:
			 *      const controller = HomePageController.createNull({ rot13Client });
			 *      const config = WwwConfig.createNull();
			 *
			 * 4. Call postAsync() and check that it returns the correct response. This is just like challenge #1, except
			 * you need to render the expected ROT-13 response into the page. You can do that by passing the expected
			 * response into homePageView.homePage():
			 *      const response = await controller.postAsync(request, config);
			 *      const expected = homePageView.homePage("my_response");
			 *      assert.deepEqual(response, expected);
			 *
			 * 5. When you run the test, it will fail with "expected undefined to deeply equal HttpResponse..." This is
			 * because postAsync() isn't returning a response.
			 *
			 * 6. Change your production code to return a hard-coded response:
			 *      return homePageView.homePage("hardcoded response");
			 *
			 * 7. This time, the test will fail with the wrong "_body" attribute in the response. It's a bit hard to read,
			 * because it's the full HTML of the page, but if you look for "<input type=\"text\" name=\"text\"...",
			 * you'll see that the value property is incorrect.
			 *
			 * 8. Change your production code to get the response from the Rot13Client and put it in the home page.
			 *      const output = await this._rot13Client.transformAsync(config.rot13ServicePort, userInput);
			 *      return homePageView.homePage(output);
			 *
			 */

			// Arrange: set up HomePageController, HttpRequest, WwwConfig, and Rot13Client -- don't forget to pass
			// Rot13Client into HomePageController

			// Act: call controller.postAsync() -- don't forget to await
			// If you get an error from rot13Client.transformAsync, make sure you're setting up the request body correctly

			// Assert: check that the result of postAsync() matches homePageView.homePage(expectedText)
		});

	});


	describe("parse edge cases", () => {

		it("finds correct form field when there are unrelated fields", async () => {
			/* CHALLENGE #4: A minor tweak
			 *
			 * This is the same kind of test as challenge #2c. Confirm that this request body works:
			 *
			 *    const body = "unrelated=one&text=two&also_unrelated=three";
			 *
			 * The test will probably pass the first time, without requiring any changes to the production code.
			 *
			 * Hints:
			 *
			 * 1. You can copy and paste the test code from challenge #2. Just change the request body:
			 *    const body = "unrelated=one&text=two&also_unrelated=three";
			 *
			 * 2. Remember to change the assertion:
			 *    assert.deepEqual(rot13Requests, [{
			 *      port: 999,           // The port of the ROT-13 service
			 *      text: "two",         // The text sent to the service
			 *    }]);
			 *
			 * 3. Start thinking about how to factor out duplication, but don't implement it yet. Instead of using
			 * beforeEach(), consider a helper method instead, such as "postAsync()". But don't refactor just yet.
			 */

			// Arrange: set up HomePageController, HttpRequest, WwwConfig, Rot13Client, and Rot13Client.trackRequests() --
			// don't forget to pass Rot13Client into HomePageController

			// Act: call controller.postAsync() -- don't forget to await

			// Assert: check the Rot13Client requests -- remember to call trackRequests() before calling postAsync()
			// If you don't see any requests, make sure you've passed rot13Client into HomePageController.createNull()
		});

		it("logs warning when form field not found (and treats request like GET)", async () => {
			/* CHALLENGE #5: Logging
			 *
			 * This is also similar to challenge #2, except now you need to handle a missing form field and log a warning.
			 * Use an empty request body in your test:
			 *
			 *    const body = "";
			 *
			 * Confirm that the controller outputs a log entry with the "monitor" alert level and returns the home page.
			 *
			 * Useful methods:
			 *
			 * 1. const log = Log.createNull() - create a Log (an object that can write to the log).
			 * 2. const config = WwwConfig.createNull({ log }) - create a WwwConfig with the provided log. Note that the
			 *      parameter is an object with an optional field named "log".
			 * 3. const logOutput = log.trackOutput() - track logging. Similar to rot13Client.trackRequests(), this returns
			 *      a reference to an empty array on the heap. Every time a new log entry is written, an object is appended
			 *      to the array. The object has the log's alert level (in the "alert" field) and any other fields that
			 *      are written in that log entry. Fields containing Error objects are converted to strings.
			 * 4. const log = config.log - get the logger.
			 * 5. log.monitor(data) - write data to the log with the "monitor" alert level. "data" must be an object, and
			 *     that object may contain any fields you like.
			 *
			 * Hints:
			 *
			 * 1. Your test needs to track log output. To do that, it needs to create a log instance, provide it to the
			 * config object, and track its output:
			 *    const log = Log.createNull();
			 *    const config = WwwConfig.createNull({ log });
			 *    const logOutput = log.trackOutput();
			 *
			 * 2. Your test needs to specify an empty request body:
			 *    const request = HttpRequest.createNull({ body: "" });
			 *
			 * 3. You also need a HomePageController, but you can use its default Rot13Client rather creating your own:
			 *    const controller = HomePageController.createNull();
			 *
			 * 4. You'll need to call postAsync() and confirm that it returns the correct response:
			 *    const response = await controller.postAsync(request, config);
			 *    assert.deepEqual(response, homePageView.homePage());
			 *
			 * 5. To break the work into smaller pieces, get this much passing before implementing the logging. When you
			 * run the test, it will probably fail with the error "Argument #2 must be a string, but it was undefined."
			 * This is happening because formData.getAll("text") is returning an empty array.
			 *
			 * 6. To fix the production code, introduce a guard clause after the getAll() line:
			 *    const textFields = formData.getAll("text");   // already exists
			 *    if (textFields.length === 0) {                // new code
			 *      return homePageView.homePage();
			 *    }
			 *
			 * 7. When the test passes, add an assertion in the test to check the log output:
			 *    assert.deepEqual(logOutput, [{
			 *      alert: "monitor",
			 *      message: "form parse error in POST /",
			 *      details: "'text' form field not found",
			 *      body: "",
			 *    }]);
			 *
			 * 8. When you run the test, it will fail saying that the logOutput is an empty array. This is because the
			 * production code isn't writing to the log.
			 *
			 * 9. Update your guard clause to write to the log. Rather than hardcoding the body, pass in the "body"
			 * variable.
			 *    config.log.monitor({
			 *      message: "form parse error in POST /",
			 *      details: "'text' form field not found",
			 *      body,
			 *    });
			 *
			 */

			// Your test here.
		});

		it("logs warning when duplicated form field found (and treats request like GET)", async () => {
			/* CHALLENGE #6: Refactoring
			 *
			 * This is similar to the last challenge, in that you need to handle bad form data and log a warning. Use
			 * this request body:
			 *
			 *    const body = "text=one&text=two";
			 *
			 * Before writing this test, look at your existing tests. There's probably a lot of duplication. Think about
			 * how to refactor it to eliminate the duplication. Then, after the test is working, look at your production
			 * code and find ways to clean it up.
			 *
			 * JavaScript syntax notes:
			 *
			 * 1. Object destructuring
			 * When an object is passed into a JavaScript function, or returned from a function, it can be "destructured."
			 * That means the fields in the object are automatically converted to variables. This is done by using object
			 * syntax (such as "{ body }") in place of a variable name. For example, the
			 * following code will print "foo" and then "bar":
			 *    const { result } = myFunction({ body: "foo" });
			 *    function myFunction({ body }) {
			 *      console.log(body);              // prints "foo"
			 *      return { result: "bar" };
			 *    }
			 *    console.log(result);              // prints "bar"
			 *
			 * 2. "Unexpected token" lint error
			 * This error occurs when you forget to put the "async" keyword on a function that uses the "await" keyword.
			 *
			 * Hints:
			 *
			 * 1. Refactor the test code however you like. I find that helper methods are more useful than beforeEach()
			 * methods. My approach was to create a postAsync() method that took optional parameters and returned an
			 * object with multiple fields. It looked like this:
			 *    const { response, rot13Requests, logOutput } = simulatePostAsync({ body, rot13Client, rot13Port });
			 *
			 * 2. In JavaScript, to implement a method that takes optional parameters, use object destructuring. For
			 * example, the above function is implemented like this:
			 *    function simulatePostAsync({
			 *      body = "text=irrelevant_input",
			 *      rot13Client = Rot13Client.createNull(),
			 *      rot13Port = IRRELEVANT_PORT,
			 *    } = {}) {
			 *      // implementation here
			 *      return {
			 *        response,
			 *        rot13Requests,
			 *        logOutput,
			 *      };
			 *    }
			 *
			 */

			// Your test here.
		});

	});


	describe("ROT-13 service edge cases", () => {

		it("fails gracefully, and logs error, when service returns error", async () => {
			/* CHALLENGE #7: Service errors
			 *
			 * Make sure the code handles errors in the ROT-13 service gracefully. Log the error with the "emergency"
			 * alert level and return the home page with "ROT-13 service failed" in the text field.
			 *
			 * Useful methods:
			 *
			 * 1. const rot13Client = Rot13Client.createNull([{ error: "my_error" }]) - create a Rot13Client that
			 *      will throw an error the first time it's called. Note that the parameter is an array of objects.
			 *      (If you wanted to control additional responses, you would add more objects to the array.)
			 * 2. log.emergency(data) - write data to the log with the "emergency" alert level. "data" must be an object,
			 *      but it may contain any fields containing any values.
			 *
			 * Hints:
			 *
			 * 1. This is similar to challenge #3 and challenge #6. Use the tests for those challenges as inspiration.
			 *
			 * 2. When the Rot13Client encounters an error, it will throw an exception. Your production code will need to
			 * catch the exception. In the exception handler, log the error.
			 *
			 * 3. Don't forget to check that the controller returns the correct home page. You don't need to do anything
			 * fancy; just put the message in the text field, like this:
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
			 * Useful methods:
			 *
			 * 1. const rot13Client = Rot13Client.createNull([{ hang: "true" }]) - create a Rot13Client that
			 *      never returns the first time it's called. Note that the parameter is an array of objects.
			 *      (If you wanted to control additional responses, you would add more objects to the array.)
			 * 2. const clock = Clock.createNull() - create a Clock instance that can be advanced programmatically.
			 * 3. await clock.advanceNullTimersAsync() - advance the clock until all timers expire.
			 * 4. await clock.timeoutAsync(timeoutInMs, promise, timeoutFnAsync) - set a timer for "timeoutInMs" and await
			 *      "promise". If the timer runs out before the promise resolves, run timeoutFnAsync and return its result
			 *      instead.
			 * 5. const { transformPromise, cancelFn } = rot13Client.transform(port, text) - just like transformAsync(),
			 *      except it returns an object with two fields. The transformPromise field is the same as the return value
			 *      of transformAsync(). The cancelFn field contains a function that will cancel the request. When a
			 *      request is cancelled, the cancellation appears in the rot13Client.trackRequests() array like this:
			 *          {
			 *            port: 9999,
			 *            text: "my_input",
			 *            cancelled: true,
			 *          }
			 *
			 * Hints:
			 *
			 * PART (a)
			 *
			 * 1. Your existing helper methods probably won't work well for this test. Build it from scratch, then look
			 * for ways to factor out commonalities.
			 *
			 * 2. You can use the Clock object to implement timeouts. Be sure to construct a null Clock in your test and
			 * pass it into HomePageController.createNull():
			 *    const clock = Clock.createNull();
			 *    const controller = HomePageController.createNull({ clock });
			 *
			 * 3. After calling postAsync(), you can call advanceNullTimersAsync() to automatically advance the clock
			 * past the timeout. But because you have to call it AFTER calling postAsync(), you can't "await" the result
			 * of postAsync() in your test. (If you do, your test will hang, because "await postAsync()" will never return.)
			 * Instead, you have to store the promise, advance the clock, and then await the promise, like this:
			 *    const responsePromise = controller.postAsync(request, config);
			 *    await clock.advanceNullTimersAsync();
			 *    const response = await responsePromise;
			 *
			 * 4. In your production code, use Clock.timeoutAsync() to implement the timeout, like this:
			 *    const { transformPromise, cancelFn } = rot13Client.transform(config.rot13ServicePort, input);
			 *    const output = await this._clock.timeoutAsync(timeoutInMs, transformPromise, () => {
			 *      // log error
			 *      // return home page
			 *    ));
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
			 *    const output = await this._clock.timeoutAsync(timeoutInMs, transformPromise, () => {
			 *      // log error
			 *      cancelFn();
			 *      // return home page
			 *    ));
			 *
			 * 7. After everything is working, be sure to look for opportunities to refactor the tests and production code.
			 *
			 */

			// Your test here.
		});

	});

});
