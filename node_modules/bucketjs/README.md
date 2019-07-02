## Installation

```
$ npm install bucketjs
```
## Example

On server:

```js
var bucket = require('bucketjs');

nodeJsServerResponse(200, '<html><head><script>' + bucket.src + '</script></head><body>OK</body></html>');
```

On client:

```js
bucket.require('/static/fa284b8114ff6ecc5e73.js', { key: 'commons.js', version: 'fa284b8114ff6ecc5e73'});
```
## require Api

```js
bucket.require(resourceUrl, options, doneCallback);
```
Accepts the following options:
 - {String} key - Unique resource key, default is resource.
 - {String} version - Unique tag for invalidate cache, default is null.
 - {Number} expire - Expiration time in ms if 0 than infinity, default is 0.
 - {Number} timeout - Request timeout in ms, default is 5000.
 - {Boolean} sync - Load resource sync, default is false.
 - {Boolean} defer - Add defer to script, default is false.
 - {Boolean} bottom - Append script to body, default is false.
 - {Boolean} link - Classic load as link for css and with src for script, default is false.
 - {Array} waitFor - Append resource after resources from list.



## Build for development

 ```
 $ npm install gulp -g
 $ npm install
 $ gulp
 ```

## Authors

  - [Pavel Silin](https://github.com/fi11)

# License

  MIT




