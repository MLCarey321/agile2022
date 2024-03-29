Nullable Infrastructure Training
================================

This example code is meant to be used as part of James Shore's training courses. It demonstrates his [Testing Without Mocks](https://www.jamesshore.com/v2/blog/2018/testing-without-mocks) patterns. It also has several coding challenges that allow you to experience the Nullable Infrastructure Wrapper patterns for yourself.

**Important**: Prior to starting the training course, make sure the code works on your machine, as follows:

1. Install [Node.js](https://nodejs.org). Make sure you install version 16.16.0. If you use a different version of Node, the tests may not pass. (If you already have Node installed, you can try using your existing version. But if the tests don't pass, you'll need to install the correct version of Node.)

2. Install [git](https://git-scm.com/) if you don't already have it installed.

3. Open a command prompt and navigate to the root of this repository (the same folder this README file is in).

4. Check out the integration branch by running `git checkout integration`.

5. Run the build and tests with `build` (on Windows) or `./build.sh` (on MacOS and Linux).

6. Confirm that the build runs and ends by saying `BUILD OK`. If it doesn't, make sure you have the correct version of Node installed, then ask James for help.

**Copyright note**: Please note that this repository is copyrighted by James Shore's company, Titanium I.T. LLC. Although you're welcome to copy it for your personal use, you may not use this material to make your own training courses without express written permission. See the "License" section below for details.


Running the Code
----------------

All scripts must be run from the root of the repository.

* To run the build and tests during development, run `watch quick` (Windows) or `./watch.sh quick` (Mac/Linux). It will automatically re-run the build every time you change a file.

* If the watch script doesn't work, you can run the build manually with `build quick` (Windows) or `./build.sh quick` (Mac/Linux).

* The build only runs tests for files that have changed. Sometimes it can get confused. Restarting the script is usually enough. To make it start from scratch, run `clean` (Windows) or `./clean.sh` (Mac/Linux).

* To run the servers, run `serve_dev 5010 5011` (Windows) or `./serve_dev.sh 5010 5011` (Mac/Linux). Then visit `http://localhost:5010` in a browser. The server will automatically restart every time you change a file.

*Note:* The `watch` script plays sounds when it runs. (One sound for success, another for lint failure, and a third for test failure.) If this bothers you, you can delete or rename the files in `build/sounds`.


Performing the Exercises
------------------------

The exercises in this repository are intended to be performed during James Shore's training course. He will explain which exercises to use and describe the patterns involved. Each set of exercises is in a branch of the repository. To check out a branch, run `git checkout <branch_name>`.

* `challenge_nullable`: A series of challenges demonstrating how to use nullable infrastructure wrappers to test glue code. Uses `_home_page_controller_null_test.js` and `home_page_controller.js`, located in the `src/www/home_page/` directory.

* `challenge_mock`: A series of challenges demonstrating how to use test doubles to test glue code. Uses `_home_page_controller_mock_test.js` and `home_page_controller.js`, located in the `src/www/home_page/` directory. 

* `challenge_mock_to_null`: A series of challenges demonstrating how to convert tests from using test doubles to using nullable infrastructure wrappers. Uses `_home_page_controller_null_test.js` and `home_page_controller.js`, located in the `src/www/home_page/` directory.

* `challenge_infrastructure`: A series of challenges demonstrating how to create nullable infrastructure wrappers from scratch. Uses `_command_line_test.js` and `command_line.js`, located in the `src/node_modules/infrastructure/` directory.


How the Servers Work
--------------------

Start the servers using the serve command described in the "Running the Code" section. E.g., `./serve_dev.sh 5010 5011`. This starts two servers: a WWW server on port 5010 and a ROT-13 service on port 5011.


### The WWW server

The WWW server serves HTML to the user. Access it from a web browser. For example, `http://localhost:5010`. The server will serve a form that allows you to encode text using ROT-13. Enter text into the text field and press the "Transform" button. Behind the scenes, the browser will send a "text" form field to the WWW server, which will send it to the ROT-13 service and serve the result back to the browser.


### The ROT-13 service

The ROT-13 service transforms text using ROT-13 encoding. In other words, `hello` becomes `uryyb`.

The service has one endpoint:

* **URL**: `/rot13/transform`
* Method: `POST`
* Headers:
	* `content-type: application/json`
* Body: JSON object containing one field:
  * `text` the text to transform
  * E.g., `{ "text": "hello" }`
* Success Response:
	* Status: 200 OK
	* Headers: `content-type: application/json`
	* Body: JSON object containing one field:
		* `transformed` the transformed text
		* E.g., `{ "transformed": "uryyb" }`
* Failure Response
	* Status: 4xx (depending on nature of error)
	* Headers: `content-type: application/json`
	* Body: JSON object containing one field:
		* `error` the error
		* E.g., `{ "error": "invalid content-type header" }`

You can make requests to the service directly using your favorite HTTP client. For example, [httpie](https://httpie.org/):

```sh
~ % http post :5011/rot13/transform content-type:application/json text=hello -v
POST /rot13/transform HTTP/1.1
Accept: application/json, */*;q=0.5
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 17
Host: localhost:5011
User-Agent: HTTPie/2.1.0
content-type: application/json

{
    "text": "hello"
}

HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 23
Content-Type: application/json
Date: Tue, 30 Jun 2020 01:14:15 GMT

{
    "transformed": "uryyb"
}
```


Finding Your Way Around
-----------------------

You don't need to know the ins-and-outs of the codebase to do the exercises. But in case you want to know more:

Branches:

* `challenge_XXX`: **Sets of exercises for use during the training course. (See the "Performing the Exercises" section.)**
* `integration`: **The completed code.**
* `dev`: Used by James Shore for work in progress.

Top-level directories and files:

* `build/`: Scripts for running the build, the servers, etc.
* `generated/`: Files generated by the build.
* `node_modules/`: Third-party modules from npm, such as Mocha (the test framework) and Chai (the assertion library)
* `src/`: **Source code**
* `build.cmd` and `build.sh`: Run the build and exit. Use the `quick` option to only build files that have changed. Use the `-T` option to see other build targets.
* `clean.cmd` and `clean.sh`: **Reset the incremental build.**
* `integrate.sh`: Merge the `dev` branch into the `integration` branch (only for use by James Shore)
* `LICENSE.txt`: Copyright and license.
* `package.json` and `package-lock.json`: Generated by `npm` (the Node package manager).
* `README.md`: This file.
* `serve_dev.cmd` and `serve_dev.sh`: **Start the servers and automatically restart when files change.** Takes two port numbers. The first is the port of the WWW server; the second is the port of the ROT-13 service.
* `watch.cmd` and `watch.sh`: **Automatically re-run the build every time a file changes.** Uses the same options as `build`.

`src/`:

* `node_modules/`: **Code shared by both servers.** Note that these are *not* third-party modules from npm.
* `rot13_service/`: **Code for the ROT-13 service.**
* `www/`: **Code for the user-facing web server.**
* `_all_servers_test.js`: Unit tests for `all_servers.js`.
* `_server_node_test.js`: Unit tests for `server_node.js`.
* `_smoke_test.js`: End-to-end integration test.
* `all_servers.js:` **Application start-up code.**
* `serve.js:` Entry point for the application (just runs all_servers.js).
* `server_node.js` Base class for both servers.

`src/node_modules/`:

* `http/`: HTTP infrastructure
* `infrastructure/`: Other infrastructure
* `util/`: Utility modules

`src/node_modules/http/`:

* `_*_test.js`: Unit and narrow integration tests.
* `generic_router.js`: A general-purpose router than can be configured to convert URL paths to method calls.
* `http_client.js`: Makes HTTP requests.
* `http_request.js`: Represents an HTTP request on the server.
* `http_response.js`: Represents an HTTP response from the server.
* `http_server.js`: Starts an HTTP server.

`src/node_modules/infrastructure/`:

* `_*_test.js`: Unit and narrow integration tests.
* `clock.js`: The system clock and time-related functions.
* `command_line.js`: Command-line arguments, stdout, and stderr. **Used in the "infrastructure" exercise.**
* `log.js`: Logging (used by the servers).

`src/node_modules/util/`:

* `_*_test.js`: Unit tests.
* `assert.js`: A thin wrapper around Chai (an assertion library). Contains some extra assertions.
* `ensure.js`: A run-time assertion library meant for use in production code. `ensure.signature()` is particularly useful for run-time type checking.
* `infrastructure_helper.js`: Useful functions for infrastructure wrappers. Only contains `trackOutput()` at present.
* `test_helper.js`: Useful functions for tests.
* `type.js` A run-time type checker.

`src/rot13_service/`:

* `_*_test.js`: Unit tests.
* `rot13_controller.js`: Endpoint for ROT-13 service.
* `rot13_logic.js`: ROT-13 transformation logic.
* `rot13_router.js`: Router for ROT-13 service.
* `rot13_server.js`: ROT-13 server.

`src/www/`:

* `home_page/`: **Code related to serving the home page.**
* `infrastructure/`: Infrastructure wrappers for the WWW server.
* `_*_test.js`: Unit tests.
* `www_config.js`: Configuration variables.
* `www_router.js`: Router for WWW server.
* `www_server.js`: WWW server.
* `www_view.js`: HTML template and error responses.

`src/www/home_page`:

* `_*_test.js`: Unit tests.
* `home_page_controller.js`: Endpoints for home page. **Used in most exercises.**
* `home_page_view.js`: HTML response for home page.

`src/www/infrastructure`:

* `_*_test.js`: Unit tests.
* `rot13_client.js`: Client for ROT-13 service.


License
-------

Copyright (c) 2020-2022 Titanium I.T. LLC

The code in this repository is licensed for use in James Shore's training
courses only. Participants in those courses may make copies for their own
personal use, but may not re-distribute the code or create their own training
course using this material.

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
