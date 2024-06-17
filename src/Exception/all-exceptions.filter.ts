import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse();
      if (typeof responseMessage === 'string') {
        message = responseMessage;
      } else if (
        typeof responseMessage === 'object' &&
        responseMessage !== null
      ) {
        message = (responseMessage as any).message || message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    console.log({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
