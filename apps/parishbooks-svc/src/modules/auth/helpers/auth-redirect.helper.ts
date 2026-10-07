export class AuthRedirectHelper {
    static verifyEmailPath(email: string): string {
        return `/verify-email?email=${encodeURIComponent(email)}`;
    }

    static resetPasswordPath(email: string): string {
        return `/reset-password?email=${encodeURIComponent(email)}`;
    }

    static onboardingPath(): string {
        return '/onboarding';
    }

    static dashboardPath(): string {
        return '/dashboard';
    }

    static signInPath(): string {
        return '/sign-in';
    }

    static signInAfterResetPath(): string {
        return '/sign-in?reset=1';
    }

    static organizationDashboardPath(slug: string): string {
        return `/dashboard/${slug}`;
    }
}
