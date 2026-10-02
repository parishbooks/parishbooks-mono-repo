'use server';

import { redirect } from 'next/navigation';
import { isValidChurchName, isValidSlug } from '@/lib/org/slug';

type ActionResult<T = void> = { success: true; data: T } | { success: false; error: string };

export type CreateWorkspaceInput = {
    name: string;
    slug: string;
    timezone: string;
    country: 'IN' | 'US';
    currency: 'INR' | 'USD';
};

/** UI-only: validates input and navigates to the dashboard without calling the API. */
export async function createWorkspace(input: CreateWorkspaceInput): Promise<ActionResult> {
    if (!isValidChurchName(input.name)) return { success: false, error: 'Enter a valid parish or church name.' };
    if (!isValidSlug(input.slug)) return { success: false, error: 'Choose a valid workspace URL slug.' };
    redirect('/dashboard');
}
