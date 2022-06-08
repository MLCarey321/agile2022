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
			 * HomePageController return the home page when it receives a GET request. Specifically:
			 *
			 *    1. In your test, call HomePageController.getAsync().
			 *    2. Assert that it returns homePageView.homePage().
			 *
			 *
			 * Useful methods:
			 *
			 * 1. const controller = HomePageController.createNull()
			 *      Create a HomePageController.
			 *
			 * 2. const response = await controller.getAsync(request, config)
			 *      Handle the GET request.
			 *
			 * 3. const request = HttpRequest.createNull()
			 *      Create an HttpRequest.
			 *
			 * 4. const config = WwwConfig.createNull()
			 *      Create a WwwConfig.
			 *
			 * 5. const response = homePageView.homePage()
			 *      Render the home page.
			 *
			 * 6. assert.deepEqual(actual, expected)
			 *      Compare two objects.
			 *
			 *
			 * JavaScript syntax notes:
			 *
			 * 1. await:
			 * Some JavaScript functions and methods are "async", which means they wrap their return value in a Promise
			 * object. Functions that return promises usually execute some of their code asynchronously, in the background.
			 * They're not done until the promise resolves. To make your code wait for a promise to resolve (and also
			 * unwrap the underlying value), use the "await" keyword. In this example codebase, it's almost always best
			 * to "await" functions that are async. They all have names that end in "Async".
			 *
			 * 2. async:
			 * If your function uses the "await" keyword, it has to be marked "async". I've done this for you in most
			 * cases. If you make a new function that uses "await", and forget to make it async, the linter will give
			 * you an "unexpected token" error on the line that has the "await" keyword. You can make a function async
			 * by putting the keyword "async" in front of the function declaration. It's a good idea to give the function
			 * a name that ends in "Async", too. Like this:
			 *      async function myFunctionAsync() {...}  // function
			 *      async myMethodAsync() {...}  // method
			 *      async () => {...}  // anonymous function
			 *
			 *
			 * Hints:
			 *
			 * 1. Your test will need a HomePageController. You can construct it with HomePageController.createNull():
			 *      const controller = HomePageController.createNull();
			 *
			 * 2. Your test will need to simulate a GET request. You can do that by calling controller.getAsync(). Don't
			 * forget to 'await' it.
			 *      const response = await controller.getAsync(request, config);
			 *
			 * 3. getAsync() expects a 'HttpRequest' object and a 'WwwConfig' object. (The router passes these two
			 * parameters to every controller method.) Both of them can be instantiated by calling their createNull()
			 * static methods:
			 *      const request = HttpRequest.createNull();
			 *      const config = WwwConfig.createNull();
			 *
			 * 4. You'll need an 'expected' value to compare against the results of getAsync(). You can use
			 * homePageView.homePage() as your expected value.
			 *      const expected = homePageView.homePage();
			 *
			 * 5. Use assert.deepEqual() to make the comparison. It checks that the contents of two objects are identical.
			 *      assert.deepEqual(response, expected);
			 *
			 * 6. When you run the test, it will fail with "unexpected undefined to deep equal HttpResponse..." This means
			 * getAsync() isn't returning a value.
			 *
			 * 7. Make the test pass by having getAsync() return the home page:
			 *      return homePageView.homePage()
			 */

			// Arrange: set up HomePageController, HttpRequest, and WwwConfig

			// Act: call controller.getAsync() -- don't forget to await (It's not strictly necessary in this case, but
			// get into the habit of using "await" on Async() methods.)

			// Assert: check that the result of getAsync() matches homePageView.homePage()
		});

		it("POST asks ROT-13 service to transform text", async () => {
			/* CHALLENGE #2a: Tracking requests
			 *
			 * This is a lot more challenging! You need to make HomePageController call the ROT-13 service when it
			 * receives a POST request. To make this easier, the challenge is broken up into three parts.
			 *
			 * For part (a), make the HomePageController call the ROT-13 service when it receives a POST request.
			 * Use a hard-coded port and text. You don't need to worry about the response for this challenge. Don't
			 * worry about errors or edge cases either. Specifically:
			 *
			 *    1. In your test, call HomePageController.postAsync().
			 *    2. Assert that postAsync called the ROT-13 service with hard-coded values.
			 *
			 *
			 * Useful methods:
			 *
			 * 1. const controller = HomePageController.createNull({ rot13Client })
			 *      Create a HomePageController that uses the provided rot13Client. Note that the parameter is an object
			 *      with an optional field named "rot13Client". Don't forget the curly braces. If you use a different
			 *      variable name for your rot13Client, you have to specify it, like this:
			 *          createNull({ rot13Client: myDifferentName });
			 *
			 * 2. const rot13Client = Rot13Client.createNull()
			 *      Create a Rot13Client.
			 *
			 * 3. const rot13Requests = rot13Client.trackRequests()
			 *      Track requests made by rot13Client. This returns a reference to an empty array on the heap. Every
			 *      time rot13Client makes a request to the ROT-13 service, an object describing the request is appended
			 *      to the array. The object looks like this:
			 *          {
			 *            port: 123,          // The port of the ROT-13 service
			 *            text: "some text"   // The text sent to the service
			 *          }
			 *
			 * 4. const response = await controller.postAsync(request, config)
			 *      Handle the POST request.
			 *
			 * 5. const transformedText = await rot13Client.transformAsync(port, text)
			 *      Call the ROT-13 service.
			 *
			 *
			 * JavaScript syntax notes:
			 *
			 * 1. Object shorthand:
			 * JavaScript objects, such as "{ rot13Client: myClient }" consist of multiple fields, each separated by a comma.
			 * Each field consists of a name ("rot13Client") and a value (the "myClient" variable). However, if the name of
			 * the variable is the same as the name of the field, you can eliminate it. So if you have a field named
			 * "rot13Client" with a variable named "rot13Client", you can just say "{ rot13Client }".
			 *
			 * 2. Optional fields and parameters:
			 * It's common for JavaScript functions to take an object as a parameter. The function will expect the object
			 * to have certain fields. Often, those fields are optional. If no value is provided, the function will fill
			 * in a default. In fact, the whole parameter can be optional. That's how HomePageController.createNull() works.
			 * If you don't provide an object with a "rot13Client" field, createNull() will fill one in for you. You can
			 * see how this works in the declaration of createNull() in home_page_controller.js (around lines 19-22).
			 *
			 *
			 * Hints:
			 *
			 * 1. When you called HomePageController.createNull() in the last challenge, it created the Rot13Client for you.
			 * But in this challenge, you’ll need access to the Rot13Client instance in your test, so you'll need to create
			 * it in your test and pass it into HomePageController, like this:
			 *      const rot13Client = Rot13Client.createNull();
			 *      const controller = HomePageController.createNull({ rot13Client });
			 *
			 * 2. Your test needs to see which requests have been made to the ROT-13 service. You can do that by calling
			 * rot13Client.trackRequests(). It returns an array that is updated every time a new request is made. Note that
			 * you have to call trackRequests() BEFORE making the request.
			 *      const rot13Requests = rot13Client.trackRequests();
			 *
			 * 3. To simulate a POST request, call controller.postAsync(). It expects HttpRequest and WwwConfig parameters,
			 * just like getAysnc() did in Challenge #1. This time, though, you can ignore the response, because your
			 * assertion will look at rot13Requests instead.
			 *      const request = HttpRequest.createNull();
			 *      const config = WwwConfig.createNull();
			 *      await controller.postAsync(request, config);
			 *
			 * 4. Compare the rot13Requests array (from rot13Client.trackRequests()) to your expected requests using
			 * assert.deepEqual(). It will contain an array of objects. Each object represents a single request. Since
			 * you're only expecting the production code to make one request, you can expect an array with one object.
			 * Like this:
			 *      assert.deepEqual(rot13Requests, [{
			 *        port: 123,           // The port of the ROT-13 service
			 *        text: "some text",   // The text sent to the service
			 *      }]);
			 *
			 * 5. When you run the test, it will fail saying the actual value is "[]" (an empty array). This means your
			 * production code isn't making any ROT-13 service requests.
			 *
			 * 6. You can call the ROT-13 service in your production code by using this._rot13Client.transformAsync().
			 * You can hardcode the port and text for this challenge, and you don't need to worry about the return value.
			 * Like this:
			 *      await this._rot13Client.transformAsync(123, "some text");
			 *
			 */

			// Arrange: set up HomePageController, HttpRequest, WwwConfig, Rot13Client, and Rot13Client.trackRequests() --
			// don't forget to pass Rot13Client into HomePageController

			// Act: call controller.postAsync() -- don't forget to await

			// Assert: check the Rot13Client requests -- remember to call trackRequests() before calling postAsync()
			// If you don't see any requests, make sure you've passed rot13Client into HomePageController.createNull()
		});


		/* CHALLENGE #2b: Dynamic port
		 *
		 * For this challenge, modify the test and production code created in Challenge #2a. Change it to use the
		 * ROT-13 service port provided in WwwConfig rather than hard-coding the value. Specifically:
		 *
		 *    1. Change the previous test to configure ROT-13 service port. Use a different port than before.
		 *    2. Change the test's assertion to match the newly-configured port.
		 *    3. Change HomePageController.postAsync() to get the port out of the config parameter.
		 *
		 *
		 * Useful methods:
		 *
		 * 1. const config = WwwConfig.createNull({ rot13ServicePort })
		 *    Create a WwwConfig with the provided ROT-13 service port. Note that the parameter is an object with an
		 *    optional field named "rot13ServicePort".
		 *
		 * 2. const port = config.rot13ServicePort
		 *    Get the ROT-13 service port.
		 *
		 *
		 * Hints:
		 *
		 * 1. Your production code will get the port from WwwConfig, so you'll need to update the "config" line of
		 * your test to provide the port. Use a different port to prove that your test is working:
		 *      const config = WwwConfig.createNull({ rot13ServicePort: 999 });
		 *
		 * 2. Remember to update your assertion to use the new port:
		 *      assert.deepEqual(rot13Requests, [{
		 *        port: 999,           // The port of the ROT-13 service
		 *        text: "some text",   // The text sent to the service
		 *      }]);
		 *
		 * 3. When you run the test, it will fail because it expected port 999, but got port 123. This means your
		 * production code isn't using the port defined in the config.
		 *
		 * 4. Change your production code to get the port out of the config object. Like this:
		 *      await this._rot13Client.transformAsync(config.rot13ServicePort, "some text");
		 *
		 */


		/* CHALLENGE #2c: Parsing the request body
		 *
		 * Modify the test and production code created in Challenge #2a again. This time, change it to parse the request
		 * body rather than hard-coding the text. Specifically:
		 *
		 *    1. Change the previous test to configure the request body. Use "text=hello%20world". This is URL-encoded
		 *       form data that matches what a browser will send.
		 *    2. Change the test's assertion to "hello world".
		 *    3. Change HomePageController.postAsync() to parse the "text" field from the request body and send
		 *       "hello world" to the ROT-13 service.
		 *
		 *
		 * Useful methods:
		 *
		 * 1. const request = HttpRequest.createNull({ body })
		 *      Create a request with the provided body. Note that the parameter is an object with an optional field
		 *      named "body".
		 *
		 * 2. const body = await request.readBodyAsync()
		 *      Read the request body.
		 *
		 * 3. const formData = new URLSearchParams(body)
		 *      Parse the request body. (URLSearchParams is part of Node's standard library.)
		 *
		 * 4. const textFields = formData.getAll("text")
		 *      Get an array containing the values of all "text" fields. The array will be empty if there are no
		 *      "text" fields.
		 *
		 *
		 * Hints:
		 *
		 * 1. Your production code will read the request body from HttpRequest, so you need to update the "request" line
		 * of your test to provide the body. Like this:
		 *      const body = "text=hello%20world";
		 *      const request = HttpRequest.createNull({ body });
		 *
		 * 2. Update your assertion to use the new text field:
		 *      assert.deepEqual(rot13Requests, [{
		 *        port: 999,           // The port of the ROT-13 service
		 *        text: "hello world", // The text sent to the service
		 *      }]);
		 *
		 * 3. When you run the test, it will fail because it expected "hello world," but got "some text". This means
		 * your production code isn't reading the request body.
		 *
		 * 4. Change your production code to read the request body:
		 *      const body = await request.readBodyAsync();
		 *
		 * 5. Parse the request body:
		 *      const formData = new URLSearchParams(requestBody);
		 *      const textFields = formData.getAll("text");
		 *      const userInput = textFields[0];
		 *
		 * 6. Modify the ROT-13 request to use the request body:
		 *      await this._rot13Client.transformAsync(config.rot13ServicePort, userInput);
		 *
		 */


		it("POST renders result of ROT-13 service call", async() => {
			/* CHALLENGE #3: Configuring responses
			 *
			 * In the previous challenge, you made the code call the ROT-13 server. In this challenge, you need to make it
			 * return the correct home page response. Specifically, the controller should return a web page with the
			 * translated ROT-13 string in the text field.
			 *
			 * Don't worry about server errors or edge cases for this challenge. Specifically:
			 *
			 *    1. In your test, configure the ROT-13 client to return "my_response".
			 *    2. Assert that HomePageController.postAsync() returns homePageView.homePage("my_response").
			 *
			 * When this challenge is complete, the code should work end to end. Check it manually as follows:
			 *
			 *    1. Run `.\serve_dev.cmd 5010 5011` (Windows) or `./serve_dev.sh 5010 5011` (Mac/Linux) on the command line
			 *    2. Access the page in a web browser: http://localhost:5010
			 *
			 *
			 * Useful methods:
			 *
			 * 1. const rot13Client = Rot13Client.createNull([{ response: "my_response" }])
			 *      Create a Rot13Client that responds with "my_response" the first time it's called. Note that the
			 *      parameter is an array of objects. (If you wanted to configure additional responses, you would add
			 *      more objects to the array.)
			 *
			 * 2. const response = homePageView.homePage("my_text")
			 *      Render the home page with "my_text" in the text field.
			 *
			 *
			 * Hints:
			 *
			 * 1. Just like in the last challenge, you'll need to create a Rot13Client in your test. But this time, you'll
			 * need to control what data it returns. You can do that by providing an array of objects, like this:
			 *      const rot13Client = Rot13Client.createNull([{ response: "my_response" }]);
			 *
			 * 2. You'll need a valid request body. Otherwise, your parsing logic will fail:
			 *      const request = HttpRequest.createNull({ body: "text=irrelevant_text" });
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
			 * because it's the full HTML of the page, but if you look for <input type=\"text\" name=\"text\" value=...>,
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
			 * This is the same kind of test as challenge #2c, except that you're checking a more complicated request
			 * body. Specifically:
			 *
			 *    1. In your test, configure the request body to be "unrelated=one&text=two&also_unrelated=three".
			 *    2. Assert that HomePageController.postAsync() returns homePageView.homePage("two").
			 *    3. Start thinking about how to factor out duplication, but don't implement it yet. Instead of using
			 *       beforeEach(), consider a helper method instead, such as "postAsync()". But don't refactor just yet.
			 *
			 * The test will probably pass the first time, without requiring any changes to the production code.
			 *
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
			 *      Write data to the log with the "monitor" alert level. "data" must be an object, and that object may
			 *      contain any fields you like.
			 *
			 *
			 * Hints:
			 *
			 * 1. Your test needs to track log output. To do that, it needs to create a log instance, provide it to the
			 * config object, and track its output:
			 *      const log = Log.createNull();
			 *      const config = WwwConfig.createNull({ log });
			 *      const logOutput = log.trackOutput();
			 *
			 * 2. Your test also needs to track ROT-13 requests. To do that, you'll need a Rot13Client:
			 *      const rot13Client = Rot13Client.createNull();
			 *      const rot13Requests = rot13Client.trackRequests();
			 *
			 * 3. Your test needs to specify an empty request body:
			 *      const request = HttpRequest.createNull({ body: "" });
			 *
			 * 3. You need a HomePageController, and it needs to use your Rot13Client:
			 *      const controller = HomePageController.createNull({ rot13Client );
			 *
			 * 4. You'll need to call postAsync() and confirm that it returns the correct response:
			 *      const response = await controller.postAsync(request, config);
			 *      assert.deepEqual(response, homePageView.homePage());
			 *
			 * 5. To break the work into smaller pieces, get this much passing before implementing the logging. When you
			 * run the test, it will probably fail with the error "Argument #2 must be a string, but it was undefined."
			 * This is happening because formData.getAll("text") is returning an empty array.
			 *
			 * 6. To fix the production code, introduce a guard clause after the getAll() line:
			 *      const textFields = formData.getAll("text");   // already exists
			 *      if (textFields.length === 0) {                // new code
			 *        return homePageView.homePage();
			 *      }
			 *
			 * 7. When the test passes, add an assertion in the test to confirm that no ROT-13 requests are being made.
			 * It should pass the first time:
			 *      assert.deepEqual(rot13Requests, []);
			 *
			 * 8. Now add an assertion to check the log output:
			 *      assert.deepEqual(logOutput, [{
			 *        alert: "monitor",
			 *        message: "form parse error in POST /",
			 *        details: "'text' form field not found",
			 *        body: "",
			 *      }]);
			 *
			 * 8. When you run the test, it will fail saying that the logOutput is an empty array. This is because the
			 * production code isn't writing to the log.
			 *
			 * 9. Update your guard clause to write to the log. Rather than hardcoding the body, pass in the "body"
			 * variable.
			 *      config.log.monitor({
			 *        message: "form parse error in POST /",
			 *        details: "'text' form field not found",
			 *        body,
			 *      });
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
			 * 1. I find that helper methods are more useful than beforeEach() methods. My approach was to create a
			 * postAsync() method that took optional parameters and returned an object with multiple fields. Like this:
			 *      function simulatePostAsync({
			 *        body = `text=${IRRELEVANT_INPUT}`,        // create an "IRRELEVANT_INPUT" constant
			 *        rot13Client = Rot13Client.createNull(),
			 *        rot13Port = IRRELEVANT_PORT,              // create an "IRRELEVANT_PORT" constant
			 *      } = {}) {
			 *        const rot13Requests = rot13Client.trackRequests();
			 *        const request = HttpRequest.createNull({ body });
			 *        const log = Log.createNull();
			 *        const logOutput = log.trackOutput();
			 *        const config = WwwConfig.createNull({ rot13ServicePort: rot13Port, log });
			 *
			 *        const controller = HomePageController.createNull({ rot13Client });
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
			 * 3. Once the code has been factored out, implementing this test is just a matter of using the new
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
			 *      });
			 *
			 * 4. To make the test pass, add another guard clause to the production code.
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
			 * Do this in two parts. Specifically:
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
			 * 1. You'll need the ability to call postAsync() without awaiting it. Start by renaming simulatePostAsync()
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
			 * 2. Next, create a new simulatePostAsync() that calls simulatePost():
			 *      function simulatePostAsync(options) {
			 *        const { responsePromise, ...remainder } = simulatePost(options);
			 *        return {
			 *          response: await responsePromise,
			 *          ...remainder
			 *        };
			 *      }
			 *
			 * 3. If you refactored correctly, all your tests should still pass.
			 *
			 * 4. You'll need the ability to control the clock. Modify simulatePost() to create a null Clock and provide
			 * it to HomePageController, then return the clock to callers:
			 *      const clock = Clock.createNull();
			 *      const controller = HomePageController.createNull({ rot13Client, clock });
			 *      ...
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
			 *      const { transformPromise } = rot13Client.transform(config.rot13ServicePort, input);
			 *      const output = await this._clock.timeoutAsync(
			 *        TIMEOUT_IN_MS,      // set this constant to 5000
			 *        transformPromise,
			 *        () => {}            // not implemented yet
			 *      );
			 *      return homePageView.homePage(output);
			 *
			 * 9. Now your tests should pass. Next, you can add an assertion for the postAsync() response:
			 *      assert.deepEqual(response, homePageView.homePage("ROT-13 service timed out");
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
			 *      };
			 *
			 * 12. That assertion will fail because your timeout function isn't writing to the log. Add the logging:
			 *      const output = await this._clock.timeoutAsync(
			 *        TIMEOUT_IN_MS,
			 *        transformPromise,
			 *        () => {
			 *          log.emergency({
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
			 *      const { transformPromise, cancelFn } = rot13Client.transform(config.rot13ServicePort, input);
			 *      const output = await this._clock.timeoutAsync(
			 *        TIMEOUT_IN_MS,
			 *        transformPromise,
			 *        () => {
			 *          log.emergency({
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
