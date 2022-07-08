import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ValidationParamsPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      throw new BadRequestException('Invalid params');
    }

    return value;
  }
}
