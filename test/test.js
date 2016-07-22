var assert = require('chai').assert;
var knapsack = require('../knapsack.js');
knapsack = new knapsack.MHKnapSack();

describe('MHKnapSack', function() {
    describe('#generatePrivateKey()', function() {
        it('should return a random super-increasing list of 16 numbers', function() {
            var previousElementSum = 0;
            var privateKey = knapsack.generatePrivateKey();

             for(var n in privateKey) {
                 if(privateKey.hasOwnProperty(n)) {
                     assert.isAbove(privateKey[n], previousElementSum);
                     previousElementSum += privateKey[n];
                 }
             }
        });
    });
});