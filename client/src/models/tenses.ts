export interface Tense {
    display: string;
    value: TenseValue;
}

export const tenseNames = [
    'PRESENT',
    'PASSE_COMPOSE',
    'IMPARFAIT',
    'PASSE_SIMPLE',
    'PLUS_QUE_PARFAIT',
    'CONDITIONNEL_PRESENT',
    'SUBJONCTIF_PRESENT',
    'SUBJONCTIF_IMPARFAIT',
    'IMPERATIF_PRESENT'
] as const;

export const tenses: Tense[] = [
    {
        display: 'Indicatif Présent',
        value: 'PRESENT'
    },
    {
        display: 'Passé Composé',
        value: 'PASSE_COMPOSE'
    },
    {
        display: 'Imparfait Indicatif',
        value: 'IMPARFAIT'
    },
    {
        display: 'Passé Simple',
        value: 'PASSE_SIMPLE'
    },
    {
        display: 'Plus-Que-Parfait',
        value: 'PLUS_QUE_PARFAIT'
    },
    {
        display: 'Conditionnel Présent',
        value: 'CONDITIONNEL_PRESENT'
    },
    {
        display: 'Subjonctif Présent',
        value: 'SUBJONCTIF_PRESENT'
    },
    {
        display: 'Subjonctif Imparfait',
        value: 'SUBJONCTIF_IMPARFAIT'
    },
    {
        display: 'Impératif Présent',
        value: 'IMPERATIF_PRESENT'
    },
];

export type TenseValue = typeof tenseNames[number];