var assert = require('chai').assert;
var knapsack = require('../knapsack.js');
knapsack = new knapsack.MHKnapSack();

var gImATeapot = "I'm a little teapot";
var gCipherText = "856,1010,1510,301,1129,301,1274,1157,1260,1260,1274,1482,301,1260,1482,1129,907,1630,1260";

describe('MHKnapSack', function() {
    describe('#generateKeyPair()', function() {
        it('should return a public key, and a private key with a random super-increasing list of 16 numbers', function() {
            var previousElementSum = 0;
            var keyPair = knapsack.generateKeyPair();
            var privateKey = keyPair[0];
            var publicKey = keyPair[1];

            assert.equal(privateKey.w.length, 8, "private key should be 8 units");
            assert.equal(publicKey.w.length, 8, "public key should be 8 units");

            for(var n in privateKey.w) {
                if(privateKey.w.hasOwnProperty(n)) {
                    assert.isAbove(privateKey.w[n], previousElementSum, "list should be super-increasing");
                    previousElementSum += privateKey.w[n];
                }
            }
        });
    });

    describe('#encrypt()', function() {
        it('should return a string of encrypted values separated by commas', function() {
            var cipherText = knapsack.encrypt(gImATeapot, {w: [295, 592, 301, 14, 28, 353, 120, 236]});
            assert.equal(cipherText, gCipherText);
        });
    });

    describe('#decrypt()', function() {
        it('should return a plain text string', function() {
            var clearText = knapsack.decrypt(gCipherText, {
                w: [2, 7, 11, 21, 42, 89, 180, 354],
                q: 881,
                r: 588
            });
            assert.equal(clearText, gImATeapot);
        });
    });

    describe('End-to-end', function() {
        it('should return be able to encrypt and decrypt a string using a generated keypair 1000 times', function() {
            for(var i = 0; i < 1000; i++) {
                var keyPair = knapsack.generateKeyPair();
                var cipherText = knapsack.encrypt(gImATeapot, keyPair[1]);
                var clearText = knapsack.decrypt(cipherText, keyPair[0]);
                assert.equal(clearText, gImATeapot);
            }
        });
    });
});