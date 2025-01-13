import { compare } from "bcryptjs";

export function isValidText(value:string, minLength = 1) {
  return value && value.trim().length >= minLength;
}

export function isValidEmail(value:string) : {isValid:boolean, message:string} {
  if(!value)// 값이 없으면 false
    return {isValid : false, message : "Email is required"};

  if(!value.includes("@"))// @가 포함되어 있어야 함
    return {isValid : false, message : "Email should contain '@'"};

  const specialCharRegex = /[!#$%^&*(),?":{}|<>]/; 
  if (specialCharRegex.test(value)) // @, ., -만 허용, 나머지 특수 문자는 허용하지 않음
    return {isValid : false, message : "Email should not contain special characters"};
    
  return {isValid : true, message : "Valid Email Address"};;
}

export function isPasswordEqual(password:string, confirmPassword:string) {
  return password === confirmPassword;
}

export async function isValidPassword(password:string, storedPassword:string) {
  return await compare(password, storedPassword);
}


