import { ErrorlogService } from '../errorlog/errorlog.service';
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    Logger,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  
  @Catch()
  export class HttpErrorFilter implements ExceptionFilter {
    constructor(private readonly errorlogService: ErrorlogService) {}

    catch(exception: HttpException, host: ArgumentsHost) {

      
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      const status = exception.getStatus
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
  
      const errorResponse = {
        code: status,
        logdate: new Date().toLocaleString(),
        path: request.url,
        method: request.method,
        message:
          status !== HttpStatus.INTERNAL_SERVER_ERROR
            ? exception.message || exception.message || null
            : 'Internal server error',
        id: 1
      };

  
      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        Logger.error(
          `${request.method} ${request.url}`,
          exception.stack,
          'ExceptionFilter',
        );
      } else {
        Logger.error(
          `${request.method} ${request.url}`,
          JSON.stringify(errorResponse),
          'ExceptionFilter',
        );
      }
  
      //response.status(status).json(errorResponse);
      console.log("Error dara : ")
      let x :any
      x = response.status(status).json(errorResponse)
      console.log("xxxxx")
     console.log(errorResponse)

      let pp = this.errorlogService.create(errorResponse)

      console.log("pppp")
      console.log(pp)
    }
  }