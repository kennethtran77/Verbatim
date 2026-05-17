import { describe, it, expect } from 'vitest';
import createVerbService from '../../../src/features/conjugation-race/services/verb_service';
import { Tense } from '../../../src/features/game/models/tenses';

const PRESENT: Tense = { display: 'Indicatif Présent', value: 'PRESENT' };
const IMPERATIF: Tense = { display: 'Impératif Présent', value: 'IMPERATIF_PRESENT' };

describe('VerbService', () => {
    describe('generateUniqueVerbs', () => {
        it('returns an empty array when amount < 1', () => {
            const service = createVerbService();
            expect(service.generateUniqueVerbs(0, [PRESENT])).toEqual([]);
            expect(service.generateUniqueVerbs(-5, [PRESENT])).toEqual([]);
        });

        it('returns the requested number of verbs', () => {
            const service = createVerbService();
            const verbs = service.generateUniqueVerbs(10, [PRESENT]);
            expect(verbs).toHaveLength(10);
        });

        it('only generates verbs in the requested tenses', () => {
            const service = createVerbService();
            const verbs = service.generateUniqueVerbs(20, [PRESENT]);
            verbs.forEach(verb => {
                expect(verb.tense.value).toBe('PRESENT');
            });
        });

        it('restricts subjects to "tu" and "vous" for IMPERATIF_PRESENT', () => {
            const service = createVerbService();
            const verbs = service.generateUniqueVerbs(30, [IMPERATIF]);
            verbs.forEach(verb => {
                expect(['tu', 'vous']).toContain(verb.subject);
            });
        });

        it('produces verbs with all required fields', () => {
            const service = createVerbService();
            const [verb] = service.generateUniqueVerbs(1, [PRESENT]);
            expect(verb).toMatchObject({
                infinitive: expect.any(String),
                tense: expect.objectContaining({ value: expect.any(String) }),
                subject: expect.any(String),
                pronominal: expect.any(Boolean),
            });
        });

        it('returns verbs with unique infinitives within a single call', () => {
            const service = createVerbService();
            const verbs = service.generateUniqueVerbs(50, [PRESENT]);
            const infinitives = verbs.map(v => v.infinitive);
            expect(new Set(infinitives).size).toBe(infinitives.length);
        });
    });

    describe('conjugateVerb', () => {
        it('conjugates "parler" in présent for "je" as "parle"', () => {
            const service = createVerbService();
            const result = service.conjugateVerb({
                infinitive: 'parler',
                tense: PRESENT,
                subject: 'je',
                pronominal: false,
            });
            expect(result).toBe('parle');
        });

        it('conjugates "être" in présent for "je" as "suis"', () => {
            const service = createVerbService();
            const result = service.conjugateVerb({
                infinitive: 'être',
                tense: PRESENT,
                subject: 'je',
                pronominal: false,
            });
            expect(result).toBe('suis');
        });

        it('conjugates "avoir" in présent for "nous" as "avons"', () => {
            const service = createVerbService();
            const result = service.conjugateVerb({
                infinitive: 'avoir',
                tense: PRESENT,
                subject: 'nous',
                pronominal: false,
            });
            expect(result).toBe('avons');
        });

        it('returns a non-empty string for any generated verb', () => {
            const service = createVerbService();
            const [verb] = service.generateUniqueVerbs(1, [PRESENT]);
            const result = service.conjugateVerb(verb);
            expect(result).toBeTypeOf('string');
            expect(result.length).toBeGreaterThan(0);
        });
    });
});
