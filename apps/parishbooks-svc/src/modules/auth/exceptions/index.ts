import { BadRequestException, ForbiddenException, HttpException, HttpStatus, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ErrorCode } from '../../../library/constants/error-codes';

export class InvalidCredentialsException extends UnauthorizedException {
    constructor(message = 'Invalid email or password.') {
        super({ message, code: ErrorCode.INVALID_CREDENTIALS });
    }
}

export class EmailNotVerifiedException extends ForbiddenException {
    constructor(redirectTo: string) {
        const message = `Email address is not verified`;
        super({ message, code: ErrorCode.EMAIL_NOT_VERIFIED, redirectTo });
    }
}

export class UserBannedException extends ForbiddenException {
    constructor(message = 'This account has been suspended.') {
        super({ message, code: ErrorCode.USER_BANNED });
    }
}

export class UserAlreadyExistsException extends BadRequestException {
    constructor(message = 'An account with this email already exists.') {
        super({ message, code: ErrorCode.USER_ALREADY_EXISTS });
    }
}

export class RefreshTokenInvalidException extends UnauthorizedException {
    constructor(message = 'Refresh token is invalid or expired.') {
        super({ message, code: ErrorCode.REFRESH_INVALID });
    }
}

export class UserNotFoundException extends NotFoundException {
    constructor(message = 'User not found.') {
        super({ message, code: ErrorCode.USER_NOT_FOUND });
    }
}

export class OtpInvalidException extends BadRequestException {
    constructor(message = 'The verification code is incorrect.') {
        super({ message, code: ErrorCode.OTP_INVALID });
    }
}

export class OtpExpiredException extends BadRequestException {
    constructor(message = 'The verification code has expired. Request a new one.') {
        super({ message, code: ErrorCode.OTP_EXPIRED });
    }
}

export class OtpRateLimitedException extends HttpException {
    constructor(message = 'Too many attempts. Request a new verification code.') {
        super({ message, code: ErrorCode.OTP_RATE_LIMITED }, HttpStatus.TOO_MANY_REQUESTS);
    }
}
