export const errorHandler = (res, error, defaultMessage) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(defaultMessage, errorMessage, error);
    res.status(500).json({ message: defaultMessage });
};
