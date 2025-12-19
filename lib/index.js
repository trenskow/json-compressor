//
// index.js
// @trenskow/json-compressor
//
// Created by Kristian Trenskow on 2025/12/19
// For license see LICENSE.
//

import equals from '@trenskow/equals';

const literals = {
	[undefined]: -1,
	[null]: -2,
	[true]: -3,
	[false]: -4,
};

const indices = {
	[-1]: undefined,
	[-2]: null,
	[-3]: true,
	[-4]: false,
};

const _deflate = (json, output, seen) => {

	const referenceIndex = seen.findIndex((item) => typeof item === 'object' && json === item);

	if (referenceIndex !== -1) {
		return `"${referenceIndex}"`;
	}

	const index = seen.findIndex((item) => equals(json, item));

	if (index !== -1) {
		return index;
	}

	if (json in literals) {
		return literals[json];
	}

	seen.push(json);

	if (typeof json === 'object') {

		if (Array.isArray(json)) {
			return _deflate.array(json, output, seen);
		}

		return _deflate.object(json, output, seen);

	}

	output.push(json);

	return output.length - 1;

};

_deflate.array = (json, output, seen) => {

	const result = ['a'];

	output.push(result);

	const index = output.length - 1;

	for (let i = 0; i < json.length; i++) {
		result.push(_deflate(json[i], output, seen));
	}

	return index;

};

_deflate.object = (json, output, seen) => {

	const result = ['o'];

	output.push(result);

	const index = output.length - 1;

	for (const key in json) {
		result.push(_deflate(key, output, seen));
		result.push(_deflate(json[key], output, seen));
	}

	return index;

};

const deflate = (json) => {

	const output = [];

	_deflate(json, output, []);

	if (output.length < 2) {
		return json;
	}

	return output;

};

const _inflate = (data, index, resolved) => {

	if (index in indices) {
		return indices[index];
	}

	if (typeof index === 'string' && index.startsWith('"') && index.endsWith('"')) {
		return resolved[parseInt(index.slice(1, -1), 10)];
	}

	const value = data[index];

	if (Array.isArray(value)) {

		if (value[0] === 'a') {
			return _inflate.array(data, index, value.slice(1), resolved);
		}

		if (value[0] === 'o') {
			return _inflate.object(data, index, value.slice(1), resolved);
		}

		return data;

	}

	return value;

};

_inflate.array = (data, index, value, resolved) => {

	const result = [];

	resolved[index] = result;

	for (let i = 0; i < value.length; i++) {
		result.push(_inflate(data, value[i], resolved));
	}

	return result;

};

_inflate.object = (data, index, value, resolved) => {

	if (value.length % 2 !== 0) {
		return value;
	}

	const result = {};

	resolved[index] = result;

	for (let i = 0; i < value.length; i += 2) {
		result[_inflate(data, value[i], resolved)] = _inflate(data, value[i + 1], resolved);
	}

	return result;

};

const inflate = (data) => {

	if (!Array.isArray(data)) {
		return data;
	}

	if (data.length < 2) {
		return data;
	}

	if (!Array.isArray(data[0])) {
		return data;
	}

	return _inflate(data, 0, {});

};

export {
	deflate,
	inflate
};

export default {
	deflate,
	inflate
};
