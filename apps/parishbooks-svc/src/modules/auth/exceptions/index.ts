import { BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
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
