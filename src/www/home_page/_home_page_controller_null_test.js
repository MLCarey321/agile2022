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
			 * 3. const request = HttpRequest.createNull() - create an HttpRequest.
			 * 4. const config = WwwConfig.createNull() - create a WwwConfig.
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

			// Arrange: set up Rot13Client, Clock, HttpRequest, WwwConfig, and HomePageController.
			const rot13Client = td.instance(Rot13Client);
			const clock = td.instance(Clock);
			const request = td.instance(HttpRequest);
			const config = td.instance(WwwConfig);
			const controller = new HomePageController(rot13Client, clock);

			// Act: call controller.getAsync()
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
			 *    2. Replace the code under the "Configuration code" comment with configuring the null instances directly.
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

			// Arrange: set up Rot13Client, Clock, HttpRequest, WwwConfig, and HomePageController.
			const rot13Client = td.instance(Rot13Client);
			const clock = td.instance(Clock);
			const request = td.instance(HttpRequest);
			const config = td.instance(WwwConfig);
			const controller = new HomePageController(rot13Client, clock);

			// Configuration code. Replace these lines with configuring the null instances instead.
			config.rot13ServicePort = 999;
			td.when(request.readBodyAsync()).thenResolve("text=hello%20world");

			// Act: call controller.postAsync()
			await controller.postAsync(request, config);

			// Assert: check the Rot13Client requests
			td.verify(rot13Client.transformAsync(999, "hello world"));
		});

		/* CHALLENGE #2b: Tracking requests
		 *
		 * For this challenge, finish converting the test in Challenge #2a. Specifically:
		 *
		 *    1. Convert the "td.instance(rot13Client)" line to use "Rot13Client.createNull()"
		 *    2. Replace the "td.verify()" line with a normal assertion.
		 *
		 *
		 * Useful methods:
		 *
		 * 1. const rot13Requests = rot13Client.trackRequests()
		 *      Track service requests made by rot13Client. This returns a reference to an empty array on the heap.
		 *      Every time rot13Client makes a request to the ROT-13 service, an object describing the request is
		 *      appended to the array. The object looks like this:
		 *          {
		 *            port: 123,          // The port of the ROT-13 service
		 *            text: "some text"   // The text sent to the service
		 *          }
		 *
		 *
		 * Hints:
		 *
		 * 1. Start by replacing the "rot13Client" line:
		 *    const rot13Client = Rot13Client.createNull();
		 *
		 * 2. The tests will fail with a "no test double invocation detected" error. This is because rot13Client isn't
		 * a test double any more. Comment out the "td.verify()" line as a stopgap to get the tests working again.
		 *
		 * 3. The "td.verify()" line checked that rot13Client.transformAsync() was called. This method made the call
		 * to the ROT-13 service. With nullable infrastructure, rather than checking if a method was called, you'll
		 * check which requests were made. To do that, you'll need to track rot13Client's requests. You can do that
		 * by calling rot13Client.trackRequests(). It returns an array that is updated every time a new request is made.
		 * Note that you have to call trackRequests() BEFORE making the call to postAsync().
		 *    const rot13Requests = rot13Client.trackRequests();
		 *
		 * 4. Compare the rot13Requests array (from rot13Client.trackRequests()) to your expected requests using
		 * assert.deepEqual(). It will contain an array of objects. Each object represents a single request. Since
		 * you're only expecting the production code to make one request, you can expect an array with one object.
		 * Like this:
		 *    assert.deepEqual(rot13Requests, [{
		 *      port: 999,           // The port of the ROT-13 service
		 *      text: "hello world",   // The text sent to the service
		 *    }]);
		 *
		 * 5. The tests should pass. Now you can delete the commented out td.verify() line. You've finished the challenge.
		 *
		 */

		it("POST renders result of ROT-13 service call", async() => {
			/* CHALLENGE #3: Configuring responses
			 *
			 * This test checks that the HomePageController returns the correct home page after calling the ROT-13 service.
			 * Convert it to use mocks. Specifically:
			 *
			 *    1. Replace calls to td.instance() with calls to createNull().
			 *    2. Replace the code under the "Configuration code" comment with configuring the null instances directly.
			 *
			 *
			 * Useful methods:
			 *
			 * 1. const rot13Client = Rot13Client.createNull([{ response: "my_response" }])
			 *      Create a Rot13Client that responds with "my_response" the first time it's called. Note that
			 *      the parameter is an array of objects. (If you wanted to control additional responses, you would
			 *      add more objects to the array.)
			 *
			 *
			 * Hints:
			 *
			 * 1. As before, start converting the "td.instance()" calls, one line at a time. Start with rot13Client.
			 * Provide the correct response and delete the "td.when(rot13Client.transformAsync(...))" line.
			 *      const rot13Client = Rot13Client.createNull({ response: "my_response" );
			 *      // DELETE: td.when(rot13Client.transformAsync(42, "irrelevant_text")).thenResolve("my_response");
			 *
			 * 2. Convert the "clock" line:
			 *      const clock = Clock.createNull();
			 *
			 * 3. Convert the "request" line, including the request body, and delete the td.when() configuration line:
			 * used by the td.when() call that you deleted.
			 *      const request = HttpRequest.createNull({ body: "text=irrelevant_text" });
			 *      // DELETE: td.when(request.readBodyAsync()).thenResolve("text=irrelevant_text");
			 *
			 * 4. Convert the "config" line. The rot13ServicePort doesn't need to be configured because the null
			 * instance will provide a default value, and we're not making any assertions about it.
			 *      const config = WwwConfig.createNull();
			 *      // DELETE: config.rot13ServicePort = 42;
			 *
			 */

			// Arrange: set up Rot13Client, Clock, HttpRequest, WwwConfig, and HomePageController.
			const rot13Client = td.instance(Rot13Client);
			const clock = td.instance(Clock);
			const request = td.instance(HttpRequest);
			const config = td.instance(WwwConfig);
			const controller = new HomePageController(rot13Client, clock);

			// Configuration code
			config.rot13ServicePort = 42;
			td.when(request.readBodyAsync()).thenResolve("text=irrelevant_text");
			td.when(rot13Client.transformAsync(42, "irrelevant_text")).thenResolve("my_response");

			// Act: call controller.postAsync()
			// If you get an error from rot13Client.transformAsync, make sure you're setting up the request body correctly
			const response = await controller.postAsync(request, config);

			// Assert: check that the result of postAsync() matches homePageView.homePage(expectedText)
			const expected = homePageView.homePage("my_response");
			assert.deepEqual(response, expected);
		});

	});


	describe("parse edge cases", () => {

		it("finds correct form field when there are unrelated fields", async () => {
			/* CHALLENGE #4: Building nullable tests
			 *
			 * Write a nullable infrastructure test from scratch. Your job is to check that the parsing code works correctly
			 * with a complicated request body. (It does, so all you need to do is write the test.) Specifically:
			 *
			 *    1. In your test, configure the request body to be "unrelated=one&text=two&also_unrelated=three".
			 *    2. Configure the ROT-13 port to be 999.
			 *    3. Assert that the ROT-13 service is called with port 999 and the text "two".
			 *
			 *
			 * Hints:
			 *
			 * 1. Start by setting up your null instances. Be sure to pass the correct body into HttpRequest.createNull()
			 * and the correct port into WwwConfig.createNull():
			 * 			const rot13Client = Rot13Client.createNull();
			 *      const clock = Clock.createNull();
			 *      const request = HttpRequest.createNull({ body: "unrelated=one&text=two&also_unrelated=three" });
			 *      const config = WwwConfig.createNull({ rot13ServicePort: 999 });
			 *      const controller = new HomePageController(rot13Client, clock);
			 *
			 * 2. Your assertion will check that the ROT-13 service was called correctly, so you'll need to track the
			 * ROT-13 service requests:
			 *      const rot13Requests = rot13Client.trackRequests();
			 *
			 * 2. Call postAsync():
			 *      await controller.postAsync(request, config);
			 *
			 * 3. Assert that the correct ROT-13 service call was made:
			 * 			assert.deepEqual(rot13Requests, [{
			 *        port: 999,
			 *        text: "two",
			 *      }]);
			 *
			 */

			// Arrange: set up Rot13Client, Clock, HttpRequest, WwwConfig, HomePageController, and
			// Rot13Client.trackRequests()

			// Act: call controller.postAsync() -- don't forget to await

			// Assert: check the Rot13Client requests -- remember to call trackRequests() before calling postAsync()
		});

		it("logs warning when form field not found (and treats request like GET)", async () => {
			/* CHALLENGE #5: Logging
			 *
			 * This test will be similar to the previous challenge, except now you need to handle a missing form field and
			 * log a warning. You'll also need to write the production code needed to make this test pass.
			 *
			 *    1. In your test, configure the request body to be "" (an empty string).
			 *    2. Assert that HomePageController.postAsync() returns homePageView.homePage().
			 *    3. Assert that the ROT-13 service was not called.
			 *    4. Assert that postAsync() writes the following log message:
			 *          {
			 *            alert: "monitor",
			 *            message: "form parse error in POST /",
			 *            details: "'text' form field not found",
			 *            body: "",
			 *          }
			 *    5. As you work, write the production code needed for these assertions to pass.
			 *
			 *
			 * Useful methods:
			 *
			 * 1. const log = Log.createNull()
			 *      Create a Log (an object that can write to the log).
			 *
			 * 2. const config = WwwConfig.createNull({ log })
			 *      Create a WwwConfig with the provided log. Note that the parameter is an object with an optional
			 *      field named "log".
			 *
			 * 3. const logOutput = log.trackOutput()
			 *      Track logging. Similar to rot13Client.trackRequests(), this returns a reference to an empty array
			 *      on the heap. Every time a new log entry is written, an object is appended to the array. The object
			 *      has the log's alert level (in the "alert" field) and any other fields that are written in that log
			 *      entry. Fields containing Error objects are converted to strings.
			 *
			 * 4. const log = config.log
			 *      Get the logger.
			 *
			 * 5. log.monitor(data)
			 *      Write data to the log with the "monitor" alert level. "data" must be an object, and
			 *     that object may contain any fields you like.
			 *
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
			 * 3. You also need a HomePageController, so you'll need a Rot13Client and a Clock:
			 *    const rot13Client = Rot13Client.createNull();
			 *    const clock = Clock.createNull();
			 *    const controller = new HomePageController(rot13Client, clock);
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
			 * This is similar to the last challenge, in that you need to handle bad form data and log a warning.
			 *
			 *    1. Before writing this test, look at your existing tests. There's probably a lot of duplication.
			 *       Refactor them to eliminate the duplication.
			 *    2. In your test, configure the request body to be "text=one&text=two".
			 *    3. Assert that HomePageController.postAsync() returns homePageView.homePage().
			 *    4. Assert that the ROT-13 service was not called.
			 *    5. Assert that postAsync() writes the following log message:
			 *          {
			 *            alert: "monitor",
			 *            message: "form parse error in POST /",
			 *            details: "multiple 'text' form fields found",
			 *            body: "text=one&text=two",
			 *          }
			 *    6. After the test is working, look at your production code and find ways to clean it up.
			 *
			 *
			 * JavaScript syntax notes:
			 *
			 * 1. Object destructuring
			 * When an object is passed into a JavaScript function, or returned from a function, it can be "destructured."
			 * That means the fields in the object are automatically converted to variables. This is done by using object
			 * syntax (such as "{ body }") in place of a variable name. For example, the following code will print
			 * "foo" and then "bar":
			 *      const { result } = myFunction({ body: "foo" });
			 *      function myFunction({ body }) {
			 *        console.log(body);              // prints "foo"
			 *        return { result: "bar" };
			 *      }
			 *      console.log(result);              // prints "bar"
			 *
			 * 2. String interpolation
			 * You can interpolate expressions into strings by using backticks to define the string and ${...} for the
			 * variable or other expression. For example, the following code will print "foobar":
			 *      const foo = "foo";
			 *      console.log(`${foo}bar`);         // prints "foobar"
			 *
			 * 3. "Unexpected token" lint error
			 * This error occurs when you forget to put the "async" keyword on a function that uses the "await" keyword.
			 *
			 *
			 * Hints:
			 *
			 * 1. Your first task is to refactor to eliminate the duplication in the tests. Although there are many
			 * ways to do this, I find that helper methods are more useful than beforeEach() methods. My approach was
			 * to create a simulatePostAsync() method that took optional parameters and returned an object with multiple
			 * fields. Like this:
			 *      async function simulatePostAsync({
			 *        body = `text=${IRRELEVANT_INPUT}`,        // create an "IRRELEVANT_INPUT" constant
			 *        rot13Client = Rot13Client.createNull(),
			 *        rot13Port = IRRELEVANT_PORT,              // create an "IRRELEVANT_PORT" constant
			 *      } = {}) {
			 *        const clock = Clock.createNull();
			 *        const rot13Requests = rot13Client.trackRequests();
			 *        const request = HttpRequest.createNull({ body });
			 *        const log = Log.createNull();
			 *        const logOutput = log.trackOutput();
			 *        const config = WwwConfig.createNull({ rot13ServicePort: rot13Port, log });
			 *
			 * 			  const controller = new HomePageController(rot13Client, clock);
			 *        const response = await controller.postAsync(request, config);
			 *
			 *        return {
			 *          response,
			 *          rot13Requests,
			 *          logOutput,
			 *        };
			 *      }
			 *
			 * 2. Once simulatePostAsync() exists, you can call it from your existing tests. For example, the test
			 * for challenge #2 looks like this:
			 *      it("POST asks ROT-13 service to transform text", async () => {
			 *        const { rot13Requests } = await simulatePostAsync({
			 *          body: "text=hello%20world",
			 *          rot13Port: 999,
			 *        });
			 *
			 *        assert.deepEqual(rot13Requests, [{
			 *          port: 999,
			 *          text: "hello world",
			 *        }]);
			 *      });
			 *
			 * 3. Refactor the remaining tests, other than challenge #1, to use simulatePostAsync().
			 *
			 * 4. Once the code has been factored out, implementing this test is just a matter of using the new
			 * abstraction and making the appropriate assertions. Like this:
			 *      const { response, rot13Requests, logOutput } = await simulatePostAsync({
			 *        body: "text=one&text=two",
			 *      });
			 *
			 *      assert.deepEqual(response, homePageView.homePage());
			 *      assert.deepEqual(rot13Requests, []);
			 *      assert.deepEqual(logOutput, [{
			 *        alert: "monitor",
			 *        message: "form parse error in POST /",
			 *        details: "multiple 'text' form fields found",
			 *        body: "text=one&text=two",
			 *      }]);
			 *
			 * 5. To make the test pass, add another guard clause to the production code.
			 */

			// Your test here.
		});

	});


	describe("ROT-13 service edge cases", () => {

		it("fails gracefully, and logs error, when service returns error", async () => {
			/* CHALLENGE #7: Service errors
			 *
			 * Make sure the code handles errors in the ROT-13 service gracefully. Specifically:
			 *
			 *    1. In your test, configure the Rot13Client to have the error "my_error".
			 *    2. Assert that HomePageController.postAsync() returns homePageView.homePage("ROT-13 service failed").
			 *    3. Assert that postAsync() writes the following log message:
			 *          {
			 *            alert: "emergency",
			 *            message: "ROT-13 service error in POST /",
			 *            error: "Error: " + Rot13Client.nullErrorString(port, "my_error"),
			 *          }
			 *
			 *
			 *  Useful methods:
			 *
			 * 1. const rot13Client = Rot13Client.createNull([{ error: "my_error" }])
			 *      Create a Rot13Client that will throw an error the first time it's called. Note that the parameter
			 *      is an array of objects. (If you wanted to control additional responses, you would add more objects
			 *      to the array.)
			 *
			 * 2. log.emergency(data)
			 *      Write data to the log with the "emergency" alert level. "data" must be an object, but it may contain
			 *      any fields containing any values.
			 *
			 * 3. Rot13Client.nullErrorString(port, error)
			 *      When Rot13Client.createNull() is configured to throw an error, the error message includes a long
			 *      and complicated string. This method provides that string.
			 *
			 *
			 * Hints:
			 *
			 * 1. This is similar to challenge #3 and challenge #6. You can use those tests as inspiration.
			 *
			 * 2. To start with, you'll need to create a Rot13Client that throws an error:
			 *      const rot13Client = Rot13Client.createNull([{ error: "my_error" }]);
			 *
			 * 3. Next, call simulatePostAsync() and retrieve the variables you need for your assertions. You'll need
			 * to provide the ROT-13 port because it's going to be part of your error assertion:
			 *      const { response, logOutput } = await simulatePostAsync({
			 *        rot13Client,
			 *        rot13Port: 999,
			 *      });
			 *
			 * 4. When you run the test, it will fail, because the production code isn't handling the error. Modify
			 * postAsync() to catch the error:
			 *      try {
			 *        const output = await this._rot13Client.transformAsync(config.rot13ServicePort, userInput);
			 *        return homePageView.homePage(output);
			 *      }
			 *      catch (error) {
			 *      }
			 *
			 * 5. Now you can test that the error handler works correctly. Assert that it returns the correct response:
			 *      assert.deepEqual(response, homePageView.homePage("ROT-13 service failed"));
			 *
			 * 6. The test will fail because the error handler isn't returning anything. Add the return value:
			 *      catch (error) {
			 *        return homePageView.homePage("ROT-13 service failed");
			 *      }
			 *
			 * 7. Finally, assert that the log is being written. The error message is complicated. You can either
			 * paste in the literal value, or you can use the Rot13Client.nullErrorString() helper method. Both
			 * approaches have their benefits: A literal string makes the test more understandable, and alerts you
			 * if the string ever changes. The helper method shields you against changes, at the cost of making
			 * the behavior of the code a little harder to understand.
			 *      assert.deepEqual(logOutput, [{
			 *        alert: "emergency",
			 *        message: "ROT-13 service error in POST /",
			 *        error: "Error: " + Rot13Client.nullErrorString(999, "my_error"),
			 *      }]);
			 *
			 * 8. The test will fail because the error handler isn't writing to the log. Add it:
			 *      catch (error) {
			 *        config.log.emergency({
			 *          message: "ROT-13 service error in POST /",
			 *          error,
			 *        });
			 *        return homePageView.homePage("ROT-13 service failed");
			 *      }
			 *
			 */

			// Your test here.
		});


		/* CHALLENGE #8: Changing the design
		 *
		 * For the next challenge, you'll need to call Rot13Client.transform() instead of Rot13Client.transformAsync().
		 * Before starting that test, refactor the code to support the new design. (Luckily, this is much easier to
		 * do with nullable infrastructure than with test doubles.) Specifically:
		 *
		 *    1. Change HomePageController.postAsync() to call rot13Client.transform() instead of transformAsync().
		 *
		 *
     * Useful methods:
     *
     * 1. const { transformPromise, cancelFn } = rot13Client.transform(port, text)
     *      Just like transformAsync(), except it returns an object with two fields. The cancelFn field isn't
     *      needed for this challenge. The transformPromise field is the same as the return value of transformAsync().
     *      Use it like this:
     *          const { transformPromise } = rot13Client.transform(port, text);
     *          const transformedText = await transformPromise;
     *
     *
     * Hints:
     *
     * 1. In your production code, modify your call to transformAsync() to use transform() instead. For example
     * if your old code was:
     *        const output = await this._rot13Client.transformAsync(config.rot13ServicePort, userInput);
     *
     * Then your new code would be:
     *        const { transformPromise } = this._rot13Client.transform(config.rot13ServicePort, userInput);
     *        const output = await transformPromise;
		 *
		 */

		it("fails gracefully, cancels request, and logs error, when service responds too slowly", async () => {
			/* CHALLENGE #9: Timeouts
			 *
			 * The final challenge! This is a tough one. Make the code handle timeouts in the ROT-13 service.
			 * Solve this one assertion at a time. Specifically:
			 *
			 *    1. In your test, configure the Rot13Client to hang when it's called.
			 *    2. Assert that HomePageController.postAsync() returns homePageView.homePage("ROT-13 service timed out").
			 *    3. Assert that postAsync() writes the following error:
			 *          {
			 *            alert: "emergency",
			 *            message: "ROT-13 service timed out in POST /",
			 *            timeoutInMs: 5000,
			 *          }
			 *    4. Assert that postAsync() cancels the ROT-13 service call.
			 *
			 *
			 * Useful methods:
			 *
			 * 1. const rot13Client = Rot13Client.createNull([{ hang: "true" }])
			 *      Create a Rot13Client that never returns the first time it's called. Note that the parameter is
			 *      an array of objects. (If you wanted to control additional responses, you would add more objects
			 *      to the array.)
			 *
			 * 2. const clock = Clock.createNull()
			 *      Create a Clock instance that can be advanced programmatically.
			 *
			 * 3. await clock.advanceNullTimersAsync()
			 *      Advance the clock until all timers expire.
			 *
			 * 4. await clock.timeoutAsync(timeoutInMs, promise, timeoutFnAsync)
			 *      Set a timer for "timeoutInMs" and await "promise". If the timer runs out before the promise
			 *      resolves, run timeoutFnAsync and return its result instead.
			 *
			 * 5. const { transformPromise, cancelFn } = rot13Client.transform(port, text)
			 *      The transformPromise field was described in the notes for the previous challenge. The cancelFn
			 *      field contains a function that will cancel the request. When a request is cancelled, the
			 *      cancellation appears in the rot13Client.trackRequests() array like this:
			 *          {
			 *            port: 999,
			 *            text: "my_input",
			 *            cancelled: true,
			 *          }
			 *
			 *
			 * Hints:
			 *
			 * 1. You'll need the ability to call postAsync() without awaiting it. Start by copying simulatePostAsync()
			 * to simulatePost() and modifying it to not await the result of postAsync(). Like this:
			 *      function simulatePost({
			 *        ...
			 *        const responsePromise = controller.postAsync(request, config);
			 *
			 *        return {
			 *          responsePromise,
			 *          rot13Requests,
			 *          logOutput,
			 *        };
			 *      }
			 *
			 * 2. Next, modify simulatePostAsync() to call simulatePost():
			 *      async function simulatePostAsync(options) {
			 *        const { responsePromise, ...remainder } = simulatePost(options);
			 *        return {
			 *          response: await responsePromise,
			 *          ...remainder
			 *        };
			 *      }
			 *
			 * 3. If you refactored correctly, all your tests should still pass.
			 *
			 * 4. You'll need the ability to control the clock. simulatePost() should already create a null Clock,
			 * so you should just need to modify the return block:
			 *      return {
			 *        responsePromise,
			 *        rot13Requests,
			 *        logOutput,
			 *        clock,
			 *      };
			 *
			 * 5. In the test itself, you'll need to cause the Rot13Client to hang. You can do that with the 'hang' field:
			 *      const rot13Client = Rot13Client.createNull([{ hang: true ]});
			 *
			 * 6. Then you'll can use your helper method to call postAsync(). You'll need all of the variables it creates:
			 *      const { responsePromise, rot13Requests, logOutput, clock } = simulatePost({
			 *        rot13Client,
			 *      });
			 *
			 * 7. Now advance the clock so all timeouts expire and wait for the results of postAsync():
			 *      await clock.advanceNullTimersAsync();
			 *      const response = await responsePromise;
			 *
			 * 8. When you run the test, they will fail with a timeout. That's because your production code is hanging.
			 * In your production code, use clock.timeoutAsync to implement a timeout:
			 *      const { transformPromise } = this._rot13Client.transform(config.rot13ServicePort, userInput);
			 *      const output = await this._clock.timeoutAsync(
			 *        TIMEOUT_IN_MS,      // set this constant to 5000
			 *        transformPromise,
			 *        () => {}            // not implemented yet
			 *      );
			 *      return homePageView.homePage(output);
			 *
			 * 9. Now your tests should pass. Next, you can add an assertion for the postAsync() response:
			 *      assert.deepEqual(response, homePageView.homePage("ROT-13 service timed out"));
			 *
			 * 10. The assertion will fail because the timeout function isn't providing a timeout value. Update it to do so:
			 *      const output = await this._clock.timeoutAsync(
			 *        TIMEOUT_IN_MS,
			 *        transformPromise,
			 *        () => {
			 *          return "ROT-13 service timed out";
			 *        }
			 *      );
			 *
			 * 11. Now you can assert that the log is written:
			 *      assert.deepEqual(logOutput, [{
			 *        alert: "emergency",
			 *        message: "ROT-13 service timed out in POST /",
			 *        timeoutInMs: 5000,
			 *      }]);
			 *
			 * 12. That assertion will fail because your timeout function isn't writing to the log. Add the logging:
			 *      const output = await this._clock.timeoutAsync(
			 *        TIMEOUT_IN_MS,
			 *        transformPromise,
			 *        () => {
			 *          config.log.emergency({
			 *            message: "ROT-13 service timed out in POST /",
			 *            timeoutInMs: TIMEOUT_IN_MS,
			 *          });
			 *          return "ROT-13 service timed out";
			 *        }
			 *      );
			 *
			 * 13. Finally, assert that the request is cancelled:
			 *      assert.deepEqual(rot13Requests, [{
			 *        port: IRRELEVANT_PORT,
			 *        text: IRRELEVANT_INPUT,
			 *      }, {
			 *        cancelled: true,
			 *        port: IRRELEVANT_PORT,
			 *        text: IRRELEVANT_INPUT,
			 *      }]);
			 *
			 * 14. The assertion will fail because the ROT-13 service call isn't being cancelled. You can cancel
			 * it by using the "cancelFn" field provided by rot13Client.transform(). First, get the variable, then
			 * call it in your timeout code:
			 *      const { transformPromise, cancelFn } = this._rot13Client.transform(config.rot13ServicePort, userInput);
			 *      const output = await this._clock.timeoutAsync(
			 *        TIMEOUT_IN_MS,
			 *        transformPromise,
			 *        () => {
			 *          config.log.emergency({
			 *            message: "ROT-13 service timed out in POST /",
			 *            timeoutInMs: TIMEOUT_IN_MS,
			 *          });
			 *          cancelFn();
			 *          return "ROT-13 service timed out";
			 *        }
			 *      );
			 *      return homePageView.homePage(output);
			 *
			 * 15. After everything is working, be sure to look for opportunities to refactor the tests and production code.
			 *
			 */

			// Your test here.
		});

	});

});
