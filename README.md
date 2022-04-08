Nullable Infrastructure Training
================================

This example code is meant to be used as part of James Shore's training courses. It demonstrates his [Testing Without Mocks](https://www.jamesshore.com/v2/blog/2018/testing-without-mocks) patterns. It also contains two sets of coding challenges that allow you to experience the Nullable Infrastructure Wrapper patterns for yourself. Those challenges may be found on these two branches:

* `exercise1`: A series of challenges demonstrating how to use nullable infrastructure wrappers to test glue code.

* `exercise2`: A series of challenges demonstrating how to create nullable infrastructure wrappers from scratch.

**Important**: Prior to starting the training course, make sure the code works. Check out the integration branch using `git checkout integration` and run the build and server as described under "Running the Code".


Running the Code
----------------

To run the code in this repository, install [Node.js](http://nodejs.org). Make sure you have version 16.14.2. If you have a different version of Node, the code will probably work, but you may experience some unexpected test failures. If that happens, make sure you have the correct version of Node installed.

* To run the build and automated tests, run `.\watch.cmd quick` (Windows) or `./watch.sh quick` (Mac/Linux) from the root directory of the repo. The build will automatically re-run every time you change a file.

* The build only runs tests for files that have changed. Sometimes it can get confused. Restarting the script is usually enough. To make it start from scratch, run `.\clean.cmd` (Windows) or `./clean.sh` (Mac/Linux).

* To run the servers, run `.\serve_dev.cmd 5010 5011` (Windows) or `./serve_dev 5010 5011` (Mac/Linux) from the root directory of the repo. Then visit `http://localhost:5010` in a browser. The server will automatically restart every time you change a file.

*Note:* The `watch` script plays sounds when it runs. (One sound for success, another for lint failure, and a third for test failure.) If this bothers you, you can delete or rename the files in `build/sounds`.


Performing the Exercises
------------------------

The exercises in this repository are intended to be performed during James Shore’s training course. He will provide
an overview of the challenges and explain the patterns involved. But briefly:

* To try the `exercise1` challenges, check out the branch using `git checkout exercise1`, then open `_home_page_controller_test.js` and `home_page_controller.js` in a code editor. Both are located in the `src/www/home_page/` directory. Run the watch script (described below) and follow the instructions in `_home_page_controller_test.js`.

* To try the `exercise2` challenges, check out the branch using `git checkout exercise2`, then open `_command_line_test.js` and `command_line.js` in a code editor. Both are located in the `src/node_modules/infrastructure/` directory. Run the watch script and follow the instructions in `_command_line_test.js`.

As you work, commit your code to the `exercise1` or `exercise2` branch. To start over, check out the `part1` or `part2` branch and make a new branch using `git checkout -b <your_branch>`.


How the Servers Work
--------------------

Start the servers using the serve command described above. E.g., `./serve_dev.sh 5010 5011`. This starts two servers: a WWW server on port 5010 and a ROT-13 service on port 5011.


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

* `dev`: Used by James Shore for work in progress.
* `exercise1`: **Challenges demonstrating how to use nullable infrastructure wrappers to test glue code.**
* `exercise2`: **Challenges demonstrating how to create nullable infrastructure wrappers from scratch.**
* `integration`: **The completed code.**
* `part1`: Same as `exercise1`. Allows you to start the exercise again.
* `part2`: Same as `exercise2`. Allows you to start the exercise again.

Top-level directories and files:

* `build/`: Scripts for running the build, the servers, etc.
* `exercise_solutions/`: Solutions for the exercises. Spoilers!
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
* `command_line.js`: Command-line arguments, stdout, and stderr. **Used in exercise 2.**
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
* `home_page_controller.js`: Endpoints for home page. **Used in exercise 1.**
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
