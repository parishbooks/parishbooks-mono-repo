import { Input } from '@parishbooks/design-system/ui/input';
import { Field, StepShell } from '../shared';

export function ChurchDetailsStep({
    churchName,
    slug,
    onChurchNameChange,
    onSlugChange,
    onSlugBlur,
}: {
    churchName: string;
    slug: string;
    onChurchNameChange: (value: string) => void;
    onSlugChange: (value: string) => void;
    onSlugBlur: () => void;
}) {
    return (
        <StepShell
            eyebrow="Welcome to ParishBooks"
            title="Tell us about your church"
            description="This is the name your team will see across your ParishBooks workspace."
        >
            <div className="flex flex-col gap-6">
                <Field id="church-name" label="Church or organization name">
                    <Input
                        id="church-name"
                        value={churchName}
                        onChange={(event) => onChurchNameChange(event.target.value)}
                        placeholder="Grace Community Church"
                        autoComplete="organization"
                        className="h-14 rounded-xl px-4 text-base"
                    />
                </Field>
                <Field id="workspace-slug" label="Workspace slug" hint="Lowercase letters, numbers, and hyphens. Used as your organization URL key.">
                    <Input
                        id="workspace-slug"
                        value={slug}
                        onChange={(event) => onSlugChange(event.target.value)}
                        onBlur={onSlugBlur}
                        placeholder="grace-community-church"
                        autoComplete="off"
                        spellCheck={false}
                        className="h-14 rounded-xl px-4 text-base"
                    />
                </Field>
            </div>
        </StepShell>
    );
}
