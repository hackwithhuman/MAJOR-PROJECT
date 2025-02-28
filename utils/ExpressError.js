class ExpressError extends Error{
    constructor(ststusCode , message){
        super();
        this.ststus = ststusCode;
        this.message = message;
    }
}

module.exports = ExpressError;