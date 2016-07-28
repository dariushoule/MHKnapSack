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
            var c = clearText.charCodeAt(i);
            var o = 0;

            for(var j = 7; j >= 0; j--) {
                o += ((c >> j) & 1) * publicKey.w[7 - j];
            }

            ciphered.push(o);
        }

        return ciphered.join(",");
    };

    self.modInverse = function(a, b) {
        var b0 = b, t, q;
        var x0 = 0, x1 = 1;
        if (b == 1) return 1;
        while (a > 1) {
            q = Math.floor(a / b);
            t = b;
            b = a % b;
            a = t;
            t = x0;
            x0 = x1 - q * x0;
            x1 = t;
        }
        if (x1 < 0) x1 += b0;
        return x1;
    };

    self.knapMax = function(val, arr){
        for(var i = 1; i <= arr.length; i++) {
            if(arr[arr.length - i] <= val) {
                return arr.length - i;
            }
        }

        return null;
    };

    self.decrypt = function(cipherText, privateKey) {
        var cipherArr = cipherText.split(",");
        var deciphered = [];

        var x = self.modInverse(privateKey.r, privateKey.q);
        for(var i = 0; i < cipherArr.length; i++) {
            var c = cipherArr[i];
            var composed = ((c * x) % privateKey.q);

            var decipheredCharacter = 0;
            while(composed > 0) {
                var index = self.knapMax(composed, privateKey.w);
                composed -= privateKey.w[index];
                decipheredCharacter |= (1 << (7 - index));
            }

            deciphered.push(decipheredCharacter);
        }

        return deciphered.map(function(elem){
            return String.fromCharCode(elem);
        }).join("");
    };

    self.generateKeyPair = function() {
        var privateKey = {
            w: [Math.round((Math.random() + 1) * 100)],
            wSum: 0,
            q: 0,
            r: 0
        };

        var publicKey = {
            w: []
        };

        privateKey.wSum = privateKey.w[0];

        for(var i = 1; i < 8; i++) {
            privateKey.w[i] = privateKey.wSum + Math.round((Math.random() + 1) * 100);
            privateKey.wSum += privateKey.w[i];
        }

        privateKey.q = privateKey.wSum + Math.round((Math.random() + 1) * 100);
        privateKey.r = self.findCoprime(privateKey.q);

        for(var i = 0; i < privateKey.w.length; i++) {
            publicKey.w[i] = (privateKey.w[i] * privateKey.r) % privateKey.q;
        }

        return [privateKey, publicKey];
    };

    self.gcd = function(a, b) {
        var t;
        while(b != 0){
            t = a;
            a = b;
            b = t % b;
        }
        return a;
    };

    self.findCoprime = function(n) {
        var r = 2;
        while(self.gcd(r, n) != 1) r++;
        return r;
    };
};

if( typeof exports !== 'undefined' ) {
    exports.MHKnapSack = MHKnapSack;
}