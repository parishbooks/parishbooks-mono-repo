import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Sans, Roboto } from 'next/font/google';
import '@parishbooks/design-system/styles/globals.css';
import { cn } from '@parishbooks/design-system/utils';
import { ThemeProvider } from '@parishbooks/design-system/theme-provider';

const notoSansHeading = Noto_Sans({
    subsets: ['latin'],
    variable: '--font-heading',
});
const roboto = Roboto({ subsets: ['latin'], variable: '--font-sans' });
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'ParishBooks',
    description: "Manage your parish's finances, members, and events.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn('h-full', 'antialiased', geistSans.variable, geistMono.variable, 'font-sans', roboto.variable, notoSansHeading.variable)}
        >
            <body className="min-h-full flex flex-col">
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
