// import { IsString, MinLength, Matches } from 'class-validator';

// export class ChangePasswordDto {
//   @IsString()
//   currentPassword: string;

//   @IsString()
//   @MinLength(8, { message: 'Password must be at least 8 characters' })
//   @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
//     message:
//       'Password must contain uppercase, lowercase, and number/special character',
//   })
//   newPassword: string;
// }
