function success({ res, StatusCode, message = "Success", result, }) {
    return res.status(StatusCode || 200).json({
        message,
        result,
    });
}
export default success;
