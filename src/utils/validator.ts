
// VALIDATION
 export interface validatable {
    value: string | number;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    min?: number;
    max?: number;
  }
  
export function validator(validateInput: validatable) {
    let isValid = true;
    if (validateInput.required) {
      isValid = isValid && validateInput.value.toString().trim().length !== 0;
    }
  
    if (
      validateInput.minLength != null &&
      typeof validateInput.value === "string"
    ) {
      isValid = isValid && validateInput.value.length >= validateInput.minLength;
    }
  
    if (
      validateInput.maxLength != null &&
      typeof validateInput.value === "string"
    ) {
      isValid = isValid && validateInput.value.length >= validateInput.maxLength;
    }
  
    if (validateInput.max != null && typeof validateInput.value === "number") {
      isValid = isValid && validateInput.value <= validateInput.max;
    }
  
    if (validateInput.min != null && typeof validateInput.value === "number") {
      isValid = isValid && validateInput.value >= validateInput.min;
    }
  
    return isValid;
  }