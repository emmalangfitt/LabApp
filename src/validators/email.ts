import { FormControl } from '@angular/forms';

/*
  Function to validate that emails are in proper format, aka
  _____@___.__ where the only special characters allowed are
  dashes, periods, and underscores.
*/
export class EmailValidator {
  static isValid(control: FormControl) {
    // requires uppercase letters, lowercase letters, numbers, dashes, periods,
    // and underscores in ____@___.__ format
    const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
    .test(
      control.value
    );

    if (re) {
      return null;
    }

    return {
      invalidEmail: true
    };
  }
}
