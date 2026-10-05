export const GENERATORS = [
    { name: 'JS Library', value: 'js-library' },
    { name: 'NestJS Library', value: 'nest-library' },
] as const;

export type GeneratorKind = (typeof GENERATORS)[number]['value'];
