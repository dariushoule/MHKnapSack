/**
 * @author Darius Houle
 *
 * Javascript implementation of the Merkle–Hellman knapsack cryptosystem
 */

var MHKnapSack = function() {

    var self = this;

    self.encrypt = function(clearText, publicKey) {
        var ciphered = [];

        for(var i = 0; i < clearText.length; i++) {
            var c = clearText[i];
            var o = 0;

            for(var j = 0; j < 8; j++) {
                o += ((c >> j) & 1) * publicKey.w[j];
            }

            ciphered.push(o);
        }
    };

    self.decrypt = function(cipherText, privateKey) {

    };

    self.generateKeyPair = function() {
        var privateKey = {
            w: [Math.round(Math.random() * 2000)],
            wSum: 0,
            q: 0,
            r: 0
        };

        var publicKey = {
            w: []
        };

        privateKey.wSum = privateKey.w[0];

        for(var i = 1; i < 8; i++) {
            privateKey.w[i] = privateKey.wSum + Math.round(Math.random() * 3000);
            privateKey.wSum += privateKey.w[i];
        }

        privateKey.q = privateKey.wSum + Math.round(Math.random() * 5000);
        privateKey.r = self.findCoprime(privateKey.q);

        for(var i = 0; i < privateKey.w.length; i++) {
            publicKey.w[i] = privateKey.w[i] * (privateKey.r % privateKey.q);
        }

        return [privateKey, publicKey];
    };

    self.findCoprime = function(n) {
        var a = 1, b = 1, c = n - 1, d = n;
        var k = Math.round((n + b)/d);
        return k * c - a;
    };
};

if( typeof exports !== 'undefined' ) {
    exports.MHKnapSack = MHKnapSack;
}