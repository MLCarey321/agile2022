// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("util/assert");
const ensure = require("util/ensure");
const td = require("testdouble");
const HttpRequest = require("http/http_request");
const WwwConfig = require("../www_config");
const homePageView = require("./home_page_view");
const Rot13Client = require("../infrastructure/rot13_client");
const HomePageController = require("./home_page_controller");
const Log = require("infrastructure/log");
const Clock = require("infrastructure/clock");

describe.only("Home Page Controller (testdouble tests)", () => {

	afterEach(() => {
		td.reset();
	});

	describe("happy paths", () => {

		it("GET renders home page", async () => {
			/* CHALLENGE #1: Using test doubles
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
			 * 1. const mock = td.instance(Class)
			 *      Create a "mock" instance of a class. E.g., "const rot13Client = td.instance(Rot13Client)".
			 *
			 * 2. const controller = HomePageController.createNull()
			 *      Create a HomePageController.
			 *
			 * 3. const response = await controller.getAsync(request, config)
			 *      Handle the GET request.
			 *
			 * 4. const response = homePageView.homePage()
			 *      Render the home page.
			 *
			 * 5. assert.deepEqual(actual, expected)
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
			 * 1. Start by creating mock versions of all your dependencies. To construct HomePageController, you'll
			 * need a mock instance of Rot13Client and Clock, and to call getAsync(), you'll need a mock instance
			 * of HttpRequest and WwwConfig. (The router passes those two parameters to every controller method.)
			 * You can create mock instances with td.instance():
			 *      const rot13Client = td.instance(Rot13Client);
			 *      const clock = td.instance(Clock);
			 *      const request = td.instance(HttpRequest);
			 *      const config = td.instance(WwwConfig);
			 *
			 * 2. Now you can construct HomePageController:
			 *      const controller = new HomePageController(rot13Client, clock);
			 *
			 * 3. Next, simulate a GET request. You can do that by calling controller.getAsync(). Don't forget to
			 * 'await' it.
			 * 	    const response = await controller.getAsync(request, config);
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

			const rot13Client = td.instance(Rot13Client);
			const clock = td.instance(Clock);
			const controller = new HomePageController(rot13Client, clock);

			const request = td.instance(HttpRequest);
			const config = td.instance(WwwConfig);
			const response = await controller.getAsync(request, config);

			const expected = homePageView.homePage();
			assert.deepEqual(response, expected);

			// Arrange: set up Rot13Client, Clock, HomePageController, HttpRequest, WwwConfig, and HomePageController.

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
			 * 1. td.verify(mock.method(arguments))
			 *      Check that a mock object's method was called with specific arguments. For example:
			 *          td.verify(rot13Client.transformAsync(123, "some text"));
			 *
			 * 2. const response = await controller.postAsync(request, config)
			 *      Handle the POST request.
			 *
			 * 3. const transformedText = await rot13Client.transformAsync(port, text)
			 *      Call the ROT-13 service.
			 *
			 *
			 * Hints:
			 *
			 * 1. Start by copying your setup from the last test. (Yes, duplication is bad. But premature abstraction
			 * is worse. We'll factor out the duplication later.)
			 *      const rot13Client = td.instance(Rot13Client);
			 *      const clock = td.instance(Clock);
			 *      const request = td.instance(HttpRequest);
			 *      const config = td.instance(WwwConfig);
			 *      const controller = new HomePageController(rot13Client, clock);
			 *
			 * 2. To simulate a POST request, call controller.postAsync(). It expects HttpRequest and WwwConfig parameters,
			 * just like getAsync() did in Challenge #1. This time, though, you can ignore the response, because your
			 * assertion is looking at rot13Client instead.
			 *      await controller.postAsync(request, config);
			 *
			 * 3. Check that rot13Client was called by postAsync. To do that, use td.verify():
			 *      td.verify(rot13Client.transformAsync(123, "some text"));
			 *
			 * 4. When you run the test, it will fail saying "there were no invocations of the test double." This means
			 * your production code isn't calling rot13Client.transformAsync().
			 *
			 * 5. You can call the ROT-13 service in your production code by using this._rot13Client.transformAsync().
			 * You can hardcode the port and text for this challenge, and you don't need to worry about the return value.
			 * Like this:
			 *      await this._rot13Client.transformAsync(123, "some text");
			 *
			 */

			const { rot13Client } = await simulatePostAsync({
				body: "text=hello%20world",
				rot13Port: 999,
			});

			td.verify(rot13Client.transform(999, "hello world"));



			// Arrange: set up Rot13Client, Clock, HomePageController, HttpRequest, WwwConfig, and HomePageController.

			// Act: call controller.postAsync() -- don't forget to await

			// Assert: check that rot13Client.transformAsync() was called
		});


		/* CHALLENGE #2b: Dynamic port
		 *
		 * For this challenge, modify the test and production code created in Challenge #2a. Change it to use the
		 * ROT-13 service port provided in WwwConfig rather than hard-coding the value. Specifically:
		 *
		 *    1. Change the previous test to configure the ROT-13 service port. Use a different port than before.
		 *    2. Change the test's assertion to match the newly-configured port.
		 *    3. Change HomePageController.postAsync() to get the port out of the config parameter.
		 *
		 *
		 * Useful methods:
		 *
		 * 1. const port = config.rot13ServicePort
		 *    Get the ROT-13 service port.
		 *
		 * 2. config.rot13ServicePort = 999;
		 *    Set the service port. This only works with mocked instances of WwwConfig, because the real WwwConfig
		 *    uses an accessor ("get" function) and doesn't provide a mutator ("set" function). Normally, to make
		 *    a mocked function return a specific value, use'd use td.when(). But testdouble doesn't support mocking
		 *    out accessors, as far as I can tell, so we just set the value directly.
		 *
		 *
		 * Hints:
		 *
		 * 1. Your production code will get the port from WwwConfig, so you'll need to set the port on the config.
		 * Use a different port to prove that your test is working:
		 *      config.rot13ServicePort = 999;
		 *
		 * 2. Remember to update your assertion to use the new port:
		 *      td.verify(rot13Client.transformAsync(999, "some text"));
		 *
		 * 3. When you run the test, it will fail because it was called with 123, but it expected port 999. This
		 * means your production code isn't using the port defined in the config.
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
		 * 1. td.when(mock.method(arguments)).thenResolve(returnValue);
		 *      Set up a mock object to return a "resolved promise" when a method is called with the exact arguments
		 *      provided. A "resolved promise" is what happens when an async function returns a value, and all the
		 *      methods we're mocking are async.
		 *          td.when(request.readBodyAsync()).thenResolve("text=hello%20world");
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
		 * 1. Your production code will read the request body from HttpRequest, so you'll need to configure your
		 * mock request to return the body. Like this:
		 *      td.when(request.readBodyAsync()).thenResolve("text=hello%20world");
		 *
		 * 2. Update your assertion to use the new text field:
		 *      td.verify(rot13Client.transformAsync(999, "hello world"));
		 *
		 * 3. When you run the test, it will fail because it was called with "some text", but expected "hello world".
		 * This means your production code isn't reading the request body.
		 *
		 * 4. Change your production code to read the request body:
		 *      const body = await request.readBodyAsync();
		 *
		 * 5. Parse the request body:
		 *      const formData = new URLSearchParams(body);
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
			 * 1. const response = homePageView.homePage("my_text")
			 *      Render the home page with "my_text" in the text field.
			 *
			 *
			 * Hints:
			 *
			 * 1. Start by copying your setup from the last test. (Yep, still keeping an eye on that duplication.)
			 *      const rot13Client = td.instance(Rot13Client);
			 *      const clock = td.instance(Clock);
			 *      const request = td.instance(HttpRequest);
			 *      const config = td.instance(WwwConfig);
			 *      const controller = new HomePageController(rot13Client, clock);
			 *
			 * 2. This time, you'll need to control what data rot13Client returns. You'll do that by configuring
			 * transformAsync(). But to configure it, you need to know what its arguments will be, which means you
			 * need to set up the port and user input first:
			 *      config.rot13ServicePort = 42;
			 *      td.when(request.readBodyAsync()).thenResolve("text=irrelevant_text");
			 *
			 * (I like to use "42" and "irrelevant_xxx" for data that's required for the test to run, but not otherwise
			 * relevant to the test at hand.)
			 *
			 * 3. Now you can configure rot13Client.transformAsync():
			 *      td.when(rot13Client.transformAsync(42, "irrelevant_text")).thenResolve("my_response");
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

			const { response } = await simulatePostAsync({
				rot13Response: "my_response",
			});
			const expected = homePageView.homePage("my_response");
			assert.deepEqual(response, expected);


			// Arrange: set up Rot13Client, Clock, HomePageController, HttpRequest, WwwConfig, and HomePageController.

			// Act: call controller.postAsync() -- don't forget to await

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
			 *    td.when(request.readBodyAsync()).thenResolve("unrelated=one&text=two&also_unrelated=three");
			 *
			 * 2. Remember to change the assertion:
			 *    td.verify(rot13Client.transformAsync(999, "two"));
			 *
			 * 3. The test should pass without needing any changes to the production code.
			 */

			const { rot13Client } = await simulatePostAsync({
				rot13Port: 999,
				body: "unrelated=one&text=two&also_unrelated=three"
			});
			td.verify(rot13Client.transform(999, "two"));


			// Arrange: set up Rot13Client, Clock, HomePageController, HttpRequest, WwwConfig, and HomePageController.

			// Act: call controller.postAsync() -- don't forget to await

			// Assert: check that rot13Client.transformAsync() was called
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
			 * 1. const mock = td.object(new Class())
			 *      Create a "mock" instance of a class. In some cases, such as when a class creates functions in its
			 *      constructor, testdouble is unable to automatically instantiate a class. This is true for the Log
			 *      class. In that case, you can instantiate the class manually, and then use td.object() to create a
			 *      mock version of the instance. For example:
			 *          const log = td.object(new Log());
			 *
			 * 2. td.verify(mock.method(), { times: 0, ignoreExtraArgs: true });
			 *      Assert that a method is never called.
			 *
			 * 3. const log = config.log
			 *      Get the logger.
			 *
			 * 4. log.monitor(data)
			 *      Write data to the log with the "monitor" alert level. "data" must be an object, and that object may
			 *      contain any fields you like.
			 *
			 *
			 * Hints:
			 *
			 * 1. Start by instantiating your mocks. You can use the same instantiation as previous tests:
			 *      const rot13Client = td.instance(Rot13Client);
			 *      const clock = td.instance(Clock);
			 *      const request = td.instance(HttpRequest);
			 *      const config = td.instance(WwwConfig);
			 *      const controller = new HomePageController(rot13Client, clock);
			 *
			 * 2. This time, you'll need to set up a mock log as well. It doesn't work with the normal instantiation,
			 * so you'll have to use td.object(). Be sure to assign it to the config object:
			 *      const log = td.object(new Log());
			 *      config.log = log;
			 *
			 * 3. Configure the body on the request:
			 *      td.when(request.readBodyAsync()).thenResolve("");
			 *
			 * 4. Now call postAsync() and confirm that it returns the correct response:
			 *      const response = await controller.postAsync(request, config);
			 *      assert.deepEqual(response, homePageView.homePage());
			 *
			 * 5. To break the work into smaller pieces, get this much working before implementing the logging. When you
			 * run the test, it will probably pass, even though it would fail in production. That's because the mock
			 * rot13Client is returning an empty string by default. (The real code would throw an exception because
			 * input is undefined.) Make the test fail by asserting that rot13Client.transformAsync isn't called:
			 *      td.verify(rot13Client.transformAsync(), { times: 0, ignoreExtraArgs: true });
			 *
			 * 6. Now the test will fail, and you'll see that it was called with 'undefined'. To fix the production
			 * code, introduce a guard clause after the getAll() line:
			 *      const textFields = formData.getAll("text");   // already exists
			 *      if (textFields.length === 0) {                // new code
			 *        return homePageView.homePage();
			 *      }
			 *
			 * 7. Now add an assertion to check the log output:
			 *      td.verify(log.monitor({
			 *        message: "form parse error in POST /",
			 *        details: "'text' form field not found",
			 *        body: "",
			 *      }));
			 *
			 * 8. When you run the test, it will fail saying that "there were no invocations of the test double," which
			 * means that log.monitor() isn't being called in production.
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

			const { response, rot13Client, log } = await simulatePostAsync({
				body: ""
			});

			assert.deepEqual(response, homePageView.homePage());
			td.verify(rot13Client.transform(), { times: 0, ignoreExtraArgs: true });
			td.verify(log.monitor({
				message: "form parse error in POST /",
				details: "'text' form field not found",
				body: "",
	     }));


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
 			 * 2. Object shorthand:
 			 * JavaScript objects, such as "{ rot13Client: myClient }" consist of multiple fields, each separated by a comma.
 			 * Each field consists of a name ("rot13Client") and a value (the "myClient" variable). However, if the name of
 			 * the variable is the same as the name of the field, you can eliminate it. So if you have a field named
 			 * "rot13Client" with a variable named "rot13Client", you can just say "{ rot13Client }".
 			 *
 			 * 3. Optional fields and parameters:
 			 * It's common for JavaScript functions to take an object as a parameter. The function will expect the object
 			 * to have certain fields. Often, those fields are optional. If no value is provided, the function will fill
 			 * in a default. In fact, the whole parameter can be optional. That's how HomePageController.createNull() works.
 			 * If you don't provide an object with a "rot13Client" field, createNull() will fill one in for you. You can
 			 * see how this works in the declaration of createNull() in home_page_controller.js (around lines 19-22).
			 *
			 * 4. String interpolation
			 * You can interpolate expressions into strings by using backticks to define the string and ${...} for the
			 * variable or other expression. For example, the following code will print "foobar":
			 *      const foo = "foo";
			 *      console.log(`${foo}bar`);         // prints "foobar"
			 *
			 * 5. "Unexpected token" lint error
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
			 *        rot13Port = IRRELEVANT_PORT,              // create an "IRRELEVANT_PORT" constant
			 *        rot13Input = IRRELEVANT_INPUT,
			 *        rot13Response = "irrelevant ROT-13 response",
			 *      } = {}) {
			 *        const rot13Client = td.instance(Rot13Client);
			 *        const clock = td.instance(Clock);
			 *        const request = td.instance(HttpRequest);
			 *        const config = td.instance(WwwConfig);
			 *        const log = td.object(new Log());
			 *        const controller = new HomePageController(rot13Client, clock);
			 *
			 *        config.rot13ServicePort = rot13Port;
			 *        config.log = log;
			 *        td.when(request.readBodyAsync()).thenResolve(body);
			 *        td.when(rot13Client.transformAsync(rot13Port, rot13Input)).thenResolve(rot13Response);
			 *
			 *        const response = await controller.postAsync(request, config);
			 *
			 *        return {
			 *          response,
			 *          rot13Client,
			 *          log,
			 *        };
			 *      }
			 *
			 * 2. Once simulatePostAsync() exists, you can call it from your existing tests. For example, the test
			 * for challenge #2 looks like this:
			 *      it("POST asks ROT-13 service to transform text", async () => {
			 *        const { rot13Client } = await simulatePostAsync({
			 *          body: "text=hello%20world",
			 *          rot13Port: 999,
			 *        });
			 *
			 *        td.verify(rot13Client.transformAsync(999, "hello world"));
			 *      });
			 *
			 * 3. Refactor the remaining tests, other than challenge #1, to use simulatePostAsync().
			 *
			 * 4. Once the code has been factored out, implementing this test is just a matter of using the new
			 * abstraction and making the appropriate assertions. Like this:
			 *      const { response, rot13Client, log } = await simulatePostAsync({
			 *        body: "text=one&text=two",
			 *      });
			 *
			 *      assert.deepEqual(response, homePageView.homePage());
			 *      td.verify(rot13Client.transformAsync(), { times: 0, ignoreExtraArgs: true });
			 *      td.verify(log.monitor({
			 *        message: "form parse error in POST /",
			 *        details: "multiple 'text' form fields found",
			 *        body: "text=one&text=two",
			 *      }));
			 *
			 * 5. To make the test pass, add another guard clause to the production code.
			 */

			const { response, rot13Client, log } = await simulatePostAsync({
				body: "text=one&text=two",
			});

			assert.deepEqual(response, homePageView.homePage());
			td.verify(rot13Client.transform(), { times: 0, ignoreExtraArgs: true });
			td.verify(log.monitor({
				message: "form parse error in POST /",
				details: "multiple 'text' form fields found",
				body: "text=one&text=two",
			}));

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
			 *            error: "Error: my_error",
			 *          }
			 *
			 *
			 *  Useful methods:
			 *
			 * 1. td.when(mock.method(arguments)).thenReject(new Error("error"));
			 *      Set up a mock object to return a "rejected promise" when a method is called with the exact arguments
			 *      provided. A "rejected promise" is what happens when async function throws an exception. For example:
			 *          td.when(rot13Client.transformAsync(rot13Port, rot13Input)).thenReject(new Error("my_error"));
			 *
			 * 2. log.emergency(data)
			 *      Write data to the log with the "emergency" alert level. "data" must be an object, but it may contain
			 *      any fields containing any values.
			 *
			 *
			 * Hints:
			 *
			 * 1. You'll need to modify your simulatePostAsync() abstraction to support causing an error. In the
			 * function declaration, add a parameter for the error, like this:
			 *      async function simulatePostAsync({
			 *        body = `text=${IRRELEVANT_INPUT}`,
			 *        rot13Port = IRRELEVANT_PORT,
			 *        rot13Input = IRRELEVANT_INPUT,
			 *        rot13Response = "irrelevant ROT-13 response",
			 *        rot13Error,
			 *      } = {}) {
			 *
			 * 2. Next, modify the body of simulatePostAsync() to make rot13Client throw an error if rot13Error is
			 * set, or to behave normally if it isn't. Like this:
			 *      if (rot13Error !== undefined) {
			 *        td.when(rot13Client.transformAsync(rot13Port, rot13Input)).thenReject(rot13Error);
			 *      }
			 *      else {
			 *        td.when(rot13Client.transformAsync(rot13Port, rot13Input)).thenResolve(rot13Response);
			 *      }
			 *
			 * 3. Now, in your test, you can use simulatePostAsync to cause the error. You'll need to define the error first:
			 *      const rot13Error = new Error("my_error");
			 *      const { response, log } = await simulatePostAsync({
			 *        rot13Error
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
			 * 7. Finally, assert that the log is being written:
			 *      td.verify(log.emergency({
			 *        message: "ROT-13 service error in POST /",
			 *        error: rot13Error,
			 *      }));
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

			const rot13Error = new Error("my_error");
			const { response, log } = await simulatePostAsync({
				rot13Error
			});

			assert.deepEqual(response, homePageView.homePage("ROT-13 service failed"));
			td.verify(log.emergency({
				message: "ROT-13 service error in POST /",
				error: rot13Error,
			}));

			// Your test here.
		});


		/* CHALLENGE #8: Changing the design
		 *
		 * For the next challenge, you'll need to call Rot13Client.transform() instead of Rot13Client.transformAsync().
		 * Before starting that test, refactor the code to support the new design. Unfortunately, this will cause
		 * your test doubles to break. Specifically:
		 *
		 *    1. Change HomePageController.postAsync() to call rot13Client.transform() instead of transformAsync().
		 *    2. Fix the tests so they pass again.
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
		 * 2. td.when(mock.method(arguments)).thenReturn(result)
		 *      Set up a mock object to return a value a method is called with the exact arguments provided.
		 *      This is similar to calling .thenResolve(), except it's used by non-async functions. For example:
		 *          td.when(rot13Client.transform(rot13Port, rot13Input)).thenReturn(result);
     *
     * 3. Promise.resolve(value)
     *      Create a "resolved promise".
     *
     * 4. Promise.reject(new Error("error"))
     *      Create a "rejected promise".
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
		 * 2. Unfortunately, changing the production code will cause several tests to break, because they assume
		 * the code is calling transformAsync(). You'll need to find every reference to transformAsync() and change
		 * it to use transform().
		 *
		 * 3. First, find the code in your simulatePostAsync() that mocks transformAsync(). If you've been following
		 * these hints exactly, it looks like this:
		 *      if (rot13Error !== undefined) {
		 *        td.when(rot13Client.transformAsync(rot13Port, rot13Input)).thenReject(rot13Error);
		 *      }
		 *      else {
		 *        td.when(rot13Client.transformAsync(rot13Port, rot13Input)).thenResolve(rot13Response);
		 *      }
		 *
		 * 4. Change the first td.when() to mock transform() and return an object with a rejected promise, like this:
		 *      td.when(rot13Client.transform(rot13Port, rot13Input)).thenReturn({
		 *        transformPromise: Promise.reject(rot13Error),
		 *      });
		 *
		 * 5. If you did it correctly, the test from challenge #7 should now be passing. Next, modify the second
		 * td.when() line. It should mock transform() and return an object with a resolved promise, like this:
		 *      td.when(rot13Client.transform(rot13Port, rot13Input)).thenReturn({
		 *        transformPromise: Promise.resolve(rot13Response),
		 *      });
		 *
		 * 6. That will fix the test from challenge #3. Now you need to fix the remaining tests (challenge #2 and
		 * challenge #4) by changing their td.verify() calls. Challenge #2 should be changed as follows:
		 * 			td.verify(rot13Client.transform(999, "hello world"));
		 *
		 * 7. And challenge #4 should be changed similarly:
		 * 			td.verify(rot13Client.transform(999, "two"));
		 *
		 * 8. The tests should all be passing, but they haven't been all fixed yet. The tests that check that
		 * the service isn't called are passing by coincidence. (Challenge #5 and challenge #6.) They need to
		 * be updated too:
		 * 			td.verify(rot13Client.transform(), { times: 0, ignoreExtraArgs: true });
		 *
		 * 9. Search the file to confirm there are no more uses of transformAsync() in any of the tests.
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
			 * 1. new Promise(() => {})
			 *      Create a promise that hangs (never resolves).
			 *
			 * 2. const clock = Clock.createNull()
			 *      Create a fake clock that can be advanced programmatically.
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
			 *      field contains a function that will cancel the request.
			 *
			 * 6. const mockFn = td.function()
			 *      Create a mock function.
			 *
			 *
			 * Hints:
			 *
			 * 1. You'll need the ability to call postAsync() without awaiting it. Start by copying simulatePostAsync()
			 * to simulatePost() and modifying it to not await the result of postAsync(). Like this:
			 *      function simulatePost({
			 *        ...
			 *        const responsePromise = controller.postAsync(request, config);
			 *        return {
			 *          responsePromise,
			 *          rot13Client,
			 *          log,
			 *        };
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
			 * 4. You'll need the ability to control the clock. Modify simulatePost() so that, rather than creating
			 * a mock instance of Clock, it creates a null Clock. Replace:
			 *      const clock = td.instance(Clock);
			 * with:
			 *      const clock = Clock.createNull();
			 * and return the clock:
			 *      return {
			 *        responsePromise,
			 *        rot13Client,
			 *        log,
			 *        clock,
			 *      };
			 *
			 * 5. You'll also need the simulatePost() to support causing a hang. In the function declaration, add
			 * a parameter for hanging, like this:
			 * function declaration, add a parameter for the error, like this:
			 *      function simulatePost({
			 *        body = `text=${IRRELEVANT_INPUT}`,
			 *        rot13Port = IRRELEVANT_PORT,
			 *        rot13Input = IRRELEVANT_INPUT,
			 *        rot13Response = "irrelevant ROT-13 response",
			 *        rot13Error,
			 *        rot13Hang = false,
			 *      } = {}) {
			 *
			 * 6. Next, modify the body of simulatePost() to hang if rot13Hang is set. Like this:
			 *      if (rot13Error !== undefined) {
			 *        td.when(rot13Client.transform(rot13Port, rot13Input)).thenReturn({
			 *          transformPromise: Promise.reject(rot13Error),
			 *        });
			 *      }
			 *      else if (rot13Hang) {
			 *        td.when(rot13Client.transform(rot13Port, rot13Input)).thenReturn({
			 *          transformPromise: new Promise(() => {}),
			 *        });
			 *      }
			 *      else {
			 *        td.when(rot13Client.transform(rot13Port, rot13Input)).thenReturn({
			 *          transformPromise: Promise.resolve(rot13Response),
			 *        });
			 *      }
			 *
			 * 7. Now you can write the test. Start by calling simulatePost():
			 *      const { responsePromise, clock, log } = simulatePost({
			 *        rot13Hang: true,
			 *      });
			 *
			 * 8. Now advance the clock so all timeouts expire and wait for the results of postAsync():
			 *      await clock.advanceNullTimersAsync();
			 *      const response = await responsePromise;
			 *
			 * 9. If you implemented the rot13Hang code correctly, the test will fail with a timeout. That's because
			 * your production code is hanging. In your production code, use clock.timeoutAsync() to implement a timeout:
			 *      const { transformPromise } = this._rot13Client.transform(config.rot13ServicePort, userInput);
			 *      const output = await this._clock.timeoutAsync(
			 *        TIMEOUT_IN_MS,      // set this constant to 5000
			 *        transformPromise,
			 *        () => {}            // not implemented yet
			 *      );
			 *      return homePageView.homePage(output);
			 *
			 * 10. Now your tests should pass. Next, you can add an assertion for the postAsync() response:
			 *      assert.deepEqual(response, homePageView.homePage("ROT-13 service timed out"));
			 *
			 * 11. The assertion will fail because the timeout function isn't providing a timeout value. Update it to do so:
			 *      const output = await this._clock.timeoutAsync(
			 *        TIMEOUT_IN_MS,
			 *        transformPromise,
			 *        () => {
			 *          return "ROT-13 service timed out";
			 *        }
			 *      );
			 *
			 * 12. Now you can assert that the log is written:
			 *      td.verify(log.emergency({
			 *        message: "ROT-13 service timed out in POST /",
			 *        timeoutInMs: 5000,
			 *      }));
			 *
			 * 13. That assertion will fail because your timeout function isn't writing to the log. Add the logging:
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
			 * 14. Now you can implement the request cancellation. First, you'll need to modify simulatePost() to
			 * support it. Start by creating a mock function called cancelFn:
			 *      const cancelFn = td.function();
			 *
			 * 15. Then, in the code that sets up the responses for rot13Client.transform(), return cancelFn:
			 *      if (rot13Error !== undefined) {
			 *        td.when(rot13Client.transform(rot13Port, rot13Input)).thenReturn({
			 *          transformPromise: Promise.reject(rot13Error),
			 *          cancelFn,
			 *        });
			 *      }
			 *      else if (rot13Hang) {
			 *        td.when(rot13Client.transform(rot13Port, rot13Input)).thenReturn({
			 *          transformPromise: new Promise(() => {}),
			 *          cancelFn,
			 *        });
			 *      }
			 *      else {
			 *        td.when(rot13Client.transform(rot13Port, rot13Input)).thenReturn({
			 *          transformPromise: Promise.resolve(rot13Response),
			 *          cancelFn,
			 *        });
			 *      }
			 *
			 * 16. Then return the mock cancelFn:
			 *      return {
			 *        responsePromise,
			 *        rot13Client,
			 *        log,
			 *        clock,
			 *        cancelFn,
			 *      };
			 *
			 * 17. That will allow you to make an assertion on it in your test:
			 *      const { responsePromise, clock, log, cancelFn } = simulatePost({
			 *        rot13Hang: true,
			 *      });
			 *      ...
			 *      td.verify(cancelFn());
			 *
			 * 18. The test will fail because cancelFn() isn't being called. In your production code, get the variable,
			 * then call it in your timeout code:
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
			 * 19. After everything is working, be sure to look for opportunities to refactor the tests and production code.
			 *
			 */
			const { responsePromise, clock, log, cancelFn } = simulatePost({
				rot13Hang: true,
			});
			await clock.advanceNullTimersAsync();
			const response = await responsePromise;

			assert.deepEqual(response, homePageView.homePage("ROT-13 service timed out"));
			td.verify(log.emergency({
				message: "ROT-13 service timed out in POST /",
				timeoutInMs: 5000,
			}));
			td.verify(cancelFn());




			// Your test here.
		});

	});

});


async function simulatePostAsync(options) {
	const { responsePromise, ...remainder } = simulatePost(options);
	return {
		response: await responsePromise,
		...remainder
	};
}

function simulatePost({
	body = `text=${IRRELEVANT_INPUT}`,
	rot13Port = IRRELEVANT_PORT,
	rot13Input = IRRELEVANT_INPUT,
	rot13Response = "irrelevant ROT-13 response",
	rot13Error,
	rot13Hang = false,
} = {}) {
	const rot13Client = td.instance(Rot13Client);
	const clock = Clock.createNull();
	const request = td.instance(HttpRequest);
	const config = td.instance(WwwConfig);
	const log = td.object(new Log());
	const cancelFn = td.function();
	const controller = new HomePageController(rot13Client, clock);

	config.rot13ServicePort = rot13Port;
	config.log = log;
	td.when(request.readBodyAsync()).thenResolve(body);

	if (rot13Error !== undefined) {
		td.when(rot13Client.transform(rot13Port, rot13Input)).thenReturn({
			transformPromise: Promise.reject(rot13Error),
			cancelFn,
		});
	}
	else if (rot13Hang) {
		td.when(rot13Client.transform(rot13Port, rot13Input)).thenReturn({
			transformPromise: new Promise(() => {}),
			cancelFn,
		});
	}
	else {
		td.when(rot13Client.transform(rot13Port, rot13Input)).thenReturn({
			transformPromise: Promise.resolve(rot13Response),
			cancelFn,
		});
	}

	const responsePromise = controller.postAsync(request, config);

	return {
		responsePromise,
		rot13Client,
		log,
		clock,
		cancelFn,
	};
}



const IRRELEVANT_INPUT = "irrelevant_input";
const IRRELEVANT_PORT = 42;