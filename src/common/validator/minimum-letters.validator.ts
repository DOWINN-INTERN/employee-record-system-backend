import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function HasMinLetters(minLetters: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'hasMinLetters',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [minLetters],
      options: { ...validationOptions, message: `${propertyName} must have at least ${minLetters} letters.` },
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value || typeof value !== 'string') {
            return false;
          }

          let count = 0;

          for (let i = 0; i < value.length; i++) {
            if (/[\p{L}]/u.test(value[i])) {
              if (++count >= minLetters) {
                return true;
              }
            }
          }

          return false;
        },
      },
    });
  };
}
