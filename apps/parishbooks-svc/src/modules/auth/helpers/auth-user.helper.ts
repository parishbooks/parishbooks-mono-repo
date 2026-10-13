import { User, UserStatus } from '@parishbooks/database';
import { AuthUser } from '../dto/auth-user.dto';

export class AuthUserHelper {
    static usernameFromUser(user: User): string {
        const fromProfile = user.profile?.fullName?.trim();
        if (fromProfile) return fromProfile;
        const local = user.email.trim().split('@')[0]?.trim() ?? '';
        const normalized = local.toLowerCase();
        return normalized.length > 0 ? normalized : 'user';
    }

    static toAuthUser(user: User, roles: string[] = []): AuthUser {
        return new AuthUser({
            id: user.id,
            email: user.email,
            emailVerified: user.status === UserStatus.ACTIVE,
            username: AuthUserHelper.usernameFromUser(user),
            roles,
            banned: false,
        });
    }
}
