//
// test.js
// @trenskow/json-compressor
//
// Created by Kristian Trenskow on 2025/12/19
// For license see LICENSE.
//

import { expect } from 'chai';

import { deflate, inflate } from '../lib/index.js';

describe('@trenskow/json-compressor', () => {

	describe('deflate()', () => {

		it ('should come back with `[-1]`.', () => {
			expect(deflate(undefined)).to.eql(undefined);
		});

		it ('should come back with `[-2]`.', () => {
			expect(deflate(null)).to.eql(null);
		});

		it ('should come back with `[-3]`.', () => {
			expect(deflate(true)).to.eql(true);
		});

		it ('should come back with `[-4]`.', () => {
			expect(deflate(false)).to.eql(false);
		});

		it ('should come back with `[[\'o\', 1, 2, 2, 1, 3, -2], \'hello\', \'world\', \'none\']`.', () => {
			expect(deflate({ hello: 'world', world: 'hello', none: null })).to.eql([['o', 1, 2, 2, 1, 3, -2], 'hello', 'world', 'none']);
		});

		it ('should come back with `[[\'a\', 1, 2, 2, -2], \'hello\', \'world\']`.', () => {
			expect(deflate(['hello', 'world', 'world', null])).to.eql([['a', 1, 2, 2, -2], 'hello', 'world']);
		});

		it ('should come back with circular reference.', () => {

			const arr = ['hello'];
			arr.push(arr);

			expect(deflate(arr)).to.eql([['a', 1, '"0"'], 'hello']);

		});

	});

	describe('inflate()', () => {

		it ('should come back with `undefined`.', () => {
			expect(inflate(undefined)).to.eql(undefined);
		});

		it ('should come back with `null`.', () => {
			expect(inflate(null)).to.eql(null);
		});

		it ('should come back with `true`.', () => {
			expect(inflate(true)).to.eql(true);
		});

		it ('should come back with `false`.', () => {
			expect(inflate(false)).to.eql(false);
		});

		it ('should come back with `{ hello: \'world\', world: \'hello\', none: null }`.', () => {
			expect(inflate([['o', 1, 2, 2, 1, 3, -2], 'hello', 'world', 'none'])).to.eql({ hello: 'world', world: 'hello', none: null });
		});

		it ('should come back with `[\'hello\', \'world\', \'world\', null]`.', () => {
			expect(inflate([['a', 1, 2, 2, -2], 'hello', 'world'])).to.eql(['hello', 'world', 'world', null]);
		});

		it ('should come back with circular reference.', () => {

			const inflated = inflate([['a', 1, '"0"'], 'hello']);

			expect(inflated[0]).to.eql('hello');
			expect(inflated[1]).to.eql(inflated);

		});

	});

});
