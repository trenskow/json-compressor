@trenskow/json-compressor
----

A simple JSON to JSON compressor for JavaScript.

It also preserves circular references – useful for stringifying complex object graphs.

# Usage

Below is an example of how to use.

````javascript
import { inflate, deflate } from '@trenskow/json-compressor';

const myObject = {
  hello: 'world'
};

myObject.circular = myObject;

const json = JSON.stringify(deflate(myObject));

inflate(JSON.parse(JSON)); // Returns copy of original instance (with circular reference preserved).
````

# License

See license in LICENSE.

