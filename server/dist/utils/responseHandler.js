export class ResponseHandler {
    static success(res, message, data = null, statusCode = 200) {
        res.status(statusCode).json({ message, data });
    }
    static error(res, message, statusCode = 500) {
        res.status(statusCode).json({ message });
    }
    static notFound(res, message) {
        res.status(404).json({ message });
    }
    static unauthorized(res, message) {
        res.status(401).json({ message });
    }
    static badRequest(res, message) {
        res.status(400).json({ message });
    }
    static forbidden(res, message) {
        res.status(403).json({ message });
    }
}
