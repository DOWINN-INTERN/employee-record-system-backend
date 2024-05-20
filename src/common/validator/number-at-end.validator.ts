import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function IsNumberAtEnd(maxCount: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNumberAtEnd',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [maxCount],
      options: { ...validationOptions, message: `Numbers should only be at the end, with a maximum of ${maxCount} number(s).` },
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value || typeof value !== 'string') {
            return false;
          }

          const endNumbers = value.match(/\p{N}+$/u);
          const numCount = value.replace(/\D/g, '').length;

          if (endNumbers) {
            const endCount = endNumbers[0].length;

            if (numCount == endCount) {
              if (endCount <= maxCount) {
                return true;
              }
            }
          } else if (numCount < 1) {
            return true;
          }

          return false;
        },
      },
    });
  };
}
