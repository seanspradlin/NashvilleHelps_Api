const dict = {};
const randomString = () => (Math.random() + 1).toString(36).substring(2, 8).toUpperCase();

function cleanup() {
  setTimeout(() => {
    Object.keys(dict).forEach(key => {
      if (!dict[key].isValid()) {
        delete dict[key];
      }
    });
    this.cleanup();
  }, 30 * 60 * 1000);
}

cleanup();

/**
 * @class Expiring value template
 */
class ExpiryValue {
  /**
   * Create a new instance of an expiring value
   * @param {Any} value The value to store
   */
  constructor(value) {
    this.value = value;
    this.expiry = new Date();
    this.expiry.setDate(this.expiry.getDate() + 1);
  }

  /**
   * Check if the value has expired
   * @returns {Boolean} valid
   */
  isValid() {
    return (new Date()) < this.expiry;
  }
}

class ExpiryStore {
  /**
   * Redeem a token
   * @param {Any} token
   * @returns {Object?} value
   */
  redeem(token) {
    const val = dict[token];

    if (!val) {
      return null;
    } else if (!val.isValid()) {
      delete dict[token];
      return null;
    }

    delete dict[token];
    return val.value;
  }

  /**
   * Generate a new value
   * @param {Any} value The value to store
   * @returns {String} token
   */
  generate(value) {
    const expiryValue = new ExpiryValue(value);
    const token = randomString();
    if (dict[token]) {
      return this.generate(value);
    }
    dict[token] = expiryValue;
    return token;
  }
}

module.exports = ExpiryStore;

