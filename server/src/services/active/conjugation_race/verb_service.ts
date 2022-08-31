import { Subject, Verb } from "../../../models/conjugation_race";
import { Tense } from "../../../models/tenses";

export interface VerbService {
    generateUniqueVerbs: (amount: number, tenses: Tense[]) => Verb[];
    conjugateVerb: (verb: Verb) => string;
}

const useVerbService = (): VerbService => {
    const shuffle = (array: any[]) => {
        let currentIndex = array.length, randomIndex;

        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
      
        return array;
    }

    const subjectMapping = {
        'je': {
            index: 0,
            gender: 'M',
            number: 'S'
        },
        'tu': {
            index: 1,
            gender: 'M',
            number: 'S'
        },
        'il': {
            index: 2,
            gender: 'M',
            number: 'S'
        },
        'elle': {
            index: 2,
            gender: 'F',
            number: 'S'
        },
        'on': {
            index: 2,
            gender: 'M',
            number: 'P'
        },
        'nous': {
            index: 3,
            gender: 'M',
            number: 'P'
        },
        'vous': {
            index: 4,
            gender: 'M',
            number: 'S'
        },
        'ils': {
            index: 5,
            gender: 'M',
            number: 'P'
        },
        'elles': {
            index: 5,
            gender: 'F',
            number: 'P'
        }
    };

    const Lefff = require('french-verbs-lefff/dist/conjugations.json');
    const FrenchVerbs = require('french-verbs');

    // remove null data from the Lefff object
    Object.keys(Lefff).forEach((key: string) => {
        const nestedObj = Lefff[key];

        Object.keys(nestedObj).forEach(nestedKey => {
            if (nestedObj[nestedKey] === null) {
                delete Lefff[key];
            }
        })
    });

    const subjects = Object.keys(subjectMapping);

    const getRandomSubject = (tense: Tense): Subject => {
        // Impératif only allows for 'tu' or 'vous'
        const choices: Subject[] = tense.value === 'IMPERATIF_PRESENT' ? ['tu', 'vous'] : subjects as Subject[];
        return choices[Math.floor(Math.random() * choices.length)];
    };

    const getRandomTense = (tenses: Tense[]): Tense => tenses[Math.floor(Math.random() * tenses.length)];

    return {
        generateUniqueVerbs(amount, tenses) {
            if (amount < 1) {
                return [];
            }

            const verbList = Object.keys(Lefff);

            const verbs: Verb[] = shuffle(verbList).splice(0, amount).map((verb: string) => {
                const tense = getRandomTense(tenses);
                const subject = getRandomSubject(tense);

                return {
                    infinitive: verb,
                    tense,
                    subject,
                    // pronominal: FrenchVerbs.isTransitive(verb)
                    pronominal: false
                }
            });

            return verbs;
        },
        conjugateVerb(verb) {
            // in passe compose and plus-que-parfait, agree if the auxiliary is etre or pronominal
            const agree = FrenchVerbs.alwaysAuxEtre(verb.infinitive) || verb.pronominal;

            return FrenchVerbs.getConjugation(
                Lefff,
                verb.infinitive,
                verb.tense.value,
                subjectMapping[verb.subject].index,
                {  // params for passé composé and plus-que-parfait
                    // only agree gender and number if verb is pronominal
                    agreeGender: agree ? subjectMapping[verb.subject].gender : 'M',
                    agreeNumber: agree ? subjectMapping[verb.subject].number : 'S',
                    // use etre for verbs that always take it, or if verb is pronominal
                },
                verb.pronominal
            );
        },
    }
};

export default useVerbService;