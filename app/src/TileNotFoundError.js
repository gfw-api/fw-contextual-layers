class TileNotFoundError extends Error {

    constructor(message = '', ...args) {
        super(message, ...args);
        this.message = `TileNotFound: ${message}`;
    }

}

module.exports = TileNotFoundError;
