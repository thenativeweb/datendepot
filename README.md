# datendepot

datendepot is a blob storage middleware.

## Installation

    $ npm install datendepot

## Quick start

First you need to add a reference to datendepot inside of your application.

```javascript
var datendepot = require('datendepot');
```

Then you can add it to your express application by calling its `use` function and handing over the `datendepot` function with the desired storage configuration.

```javascript
app.use('/blob', daten({
  storage: 'File',
  options: {
    directory: '/tmp/blobs'
  }
}));
```

Now the middleware is running and provides routes for accessing the blog storage. If you want to store data, send the data in the body of a `POST` request to `/blob/`. If storing the data was successful, you will get an id as result.

If you want to fetch the data again, send a `GET` request to `/blob/<id>`.

## Running the build

This module can be built using [Grunt](http://gruntjs.com/). Besides running the tests, this also analyses the code. To run Grunt, go to the folder where you have installed datendepot and run `grunt`. You need to have [grunt-cli](https://github.com/gruntjs/grunt-cli) installed.

    $ grunt

## License

The MIT License (MIT)
Copyright (c) 2015 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
