// export const createHttpError = (statusCode: number, message: string) => {
//   const error = new Error(message) as Error & { statusCode: number };
//   error.statusCode = statusCode;
//   return error;
// };

class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default HttpError;
