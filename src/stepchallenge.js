import * as firebase from 'firebase';
class StepChallenge {
    //static storageKey = 'rvhsc_email';
    static storageKey = 'scdemo_email';


    static config = {

        apiKey: "AIzaSyA7a2nFcrZf9jdqE7hMsWM9mjIXzjHT8Kw",
        authDomain: "rv-step-challenge-6fa67.firebaseapp.com",
        databaseURL: "https://rv-step-challenge-6fa67.firebaseio.com",
        storageBucket: "rv-step-challenge-6fa67.appspot.com",
        messagingSenderId: "994525993445"
    };


    static currentUser(){
        try{
            return window.localStorage.getItem(StepChallenge.storageKey);
        } catch(e){
            //todo
        }
    }

    static logout(){
        if(window.localStorage){
            window.localStorage.removeItem(StepChallenge.storageKey);
        }
        window.location.href="/";
    }

    static checkValidUser(nextState, replace){
        try {
            if (!window.localStorage) {
                StepChallenge.createLocalStorage();
            }
            const email = window.localStorage.getItem(StepChallenge.storageKey);

            if (!email) {
                replace({pathname: '/auth', state: {nextPathname: nextState.location.pathname}});
            }
        } catch (e){
            //todo
        }

    }

    static loginUser(email){
        if (!window.localStorage){
            StepChallenge.createLocalStorage();
        }
        try{
            window.localStorage.setItem(StepChallenge.storageKey,email);
        } catch (e){
            //todo
        }

    }
    static showMessage(cls){
        document.getElementById("message").className+=" notify ";
        if (cls){
            document.getElementById("message").className+=" "+cls+" ";
        }
        setTimeout(function(){
            document.getElementById("message").className=document.getElementById("message").className.replace(/notify/,'');
            if (cls){
                let re = new RegExp(cls,"g")
                document.getElementById("message").className=document.getElementById("message").className.replace(re,'');
            }
        },1000)
    }
    static createLocalStorage(){
        if (!window.localStorage) {
            Object.defineProperty(window, "localStorage", new (function () {
                var aKeys = [], oStorage = {};
                Object.defineProperty(oStorage, "getItem", {
                    value: function (sKey) { return sKey ? this[sKey] : null; },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "key", {
                    value: function (nKeyId) { return aKeys[nKeyId]; },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "setItem", {
                    value: function (sKey, sValue) {
                        if(!sKey) { return; }
                        document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "length", {
                    get: function () { return aKeys.length; },
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "removeItem", {
                    value: function (sKey) {
                        if(!sKey) { return; }
                        document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                this.get = function () {
                    var iThisIndx;
                    for (var sKey in oStorage) {
                        iThisIndx = aKeys.indexOf(sKey);
                        if (iThisIndx === -1) { oStorage.setItem(sKey, oStorage[sKey]); }
                        else { aKeys.splice(iThisIndx, 1); }
                        delete oStorage[sKey];
                    }
                    for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) { oStorage.removeItem(aKeys[0]); }
                    for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
                        aCouple = aCouples[nIdx].split(/\s*=\s*/);
                        if (aCouple.length > 1) {
                            oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
                            aKeys.push(iKey);
                        }
                    }
                    return oStorage;
                };
                this.configurable = false;
                this.enumerable = true;
            })());
        }
    }


}

export default StepChallenge