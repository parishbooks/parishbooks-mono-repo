export const GENERATORS = [{ name: 'JS Library', value: 'js-library' }] as const;

export type GeneratorKind = (typeof GENERATORS)[number]['value'];
