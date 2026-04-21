function globalErrorHandler(err, req, res, next) {
    res
        .status(err.StatusCode || 500)
        .json({
        message: err.message,
        stack: err.stack,
        cause: err.cause,
        error: err,
    });
}
export default globalErrorHandler;
