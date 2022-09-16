class CustomError extends Error {
    
    constructor(message, status) {
        super();
        this.status = status,
            this.message = message
    }

    static alreadyExist(message = "User is Exist ") {
        return new CustomError(message, 400)
    }

    static passwordNotMatch(message = "Password Or Email Not Match !") {
        return new CustomError(message, 401)
    }

    static allFieldAreRequired(message = "All Field are Required !") {
        return new CustomError(message, 500)
    }
    static unAuthorize(message = "unAutorize User") {
        return new CustomError(message, 401)
    }
    static params(message = "params are required ", status = 401) {
        return new CustomError(message, status)
    }
}

module.exports = CustomError