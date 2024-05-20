import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function HasConsecutiveLetters(minConsecutiveLetters: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'hasConsecutiveLetters',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [minConsecutiveLetters],
      options: { ...validationOptions, message: `${propertyName} must have at least ${minConsecutiveLetters} consecutive letters.` },
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value || typeof value !== 'string') {
            return false;
          }

          let count = 0;

          for (let i = 0; i < value.length; i++) {
            if (/[\p{L}]/u.test(value[i])) {
              if (++count >= minConsecutiveLetters) {
                return true;
              }
            } else {
              count = 0;
            }
          }

          return false;
        },
      },
    });
  };
}
