
const _ = require('lodash');

module.exports.hasRequired = function (required, data, checkLength) {
    if (typeof checkLength === 'undefined') checkLength = false;
    let MissingRequiredException = {};
    let success = true;
    try {
        required.forEach(function (r) {
            if (!Object.hasOwnProperty.call(data, r) || data[r] === null) throw MissingRequiredException;
            if (checkLength && (typeof data[r] === 'string' || Array.isArray(data[r])) && !data[r].length) throw MissingRequiredException;
        });
    }
    catch (err) {
        success = (err !== MissingRequiredException);
    }
    return success;
};

module.exports.errorResponse = function (err, res) {
    console.log(err);
    return res.status(err.status ? err.status : 500).json({ success: false, error: err.error ? err.error : 'Server Error' });
};

module.exports.makeCode = function (length, type) {
    if (typeof type === 'undefined') var type = 'numeric';
    let text = '';
    let possible = {
        alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        numeric: '0123456789',
        complex: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_#$%abcdefghijklmnopqrstuvwxyz_#$%0123456789_#$%',
    };
    for (let i = 0; i < length; i++) {
        text += possible[type].charAt(Math.floor(Math.random() * possible[type].length));
    }
    return text;
};

module.exports.makeSalt = function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
};

module.exports.validatePresenceOf = function (value) {
    return value && value.length;
};

module.exports.isUserAuthorized = function (allowedProfiles, userProfiles) {
    let authorized = false;

    for (const allowedProfile of allowedProfiles) {
        let userProfileIndex = _.findIndex(userProfiles, (userProf) => { return userProf === allowedProfile });
        if (userProfileIndex >= 0) {
            authorized = true;
            break;
        }
    }

    return authorized;
};

module.exports.isMongoObjectId = (id) => {
    return id.match(/^[0-9a-fA-F]{24}$/);
};

module.exports.getAddressObject = (addressObject) => {
    let address = { street: '', streetNumber: '', city: '', state: '', country: '', zipCode: '' };
    if (typeof addressObject === 'undefined') return address;

    for (let prop in address) {

        if (typeof addressObject[prop] !== 'undefined') {
            address[prop] = addressObject[prop];
        }

    }

    return address;
};

// Create a new object, that prototypally inherits from the Error constructor.
function MyError(code, message) {
    Error.call(this);
    Error.captureStackTrace(this);
    this.name = message || 'MyError';
    this.message = message || 'Server Error';
    this.code = code;
    this.status = code;
    this.statusCode = code;
    this.error = message;
}
MyError.prototype = Object.create(Error.prototype);
MyError.prototype.constructor = MyError;
module.exports.MyError = MyError;
