import Response from '../../models/response';
import { Tense } from '../../models/tenses';

export interface TenseStore {
    validateTenses: (tenseValues: string[]) => Response<Tense[]>;
}

const useTenseStore = (tenses: Tense[]): TenseStore => {
    return {
        validateTenses: (tenseValues) => {
            let tenseItems: Tense[] = [];

            for (let tenseValue of tenseValues) {
                const tenseItem = tenses.find(tense => tense.value === tenseValue);

                if (!tenseItem) {
                    return {
                        success: false,
                        message: "Invalid tenses."
                    };
                }

                tenseItems.push(tenseItem);
            }

            return {
                success: true,
                message: "Validated tenses.",
                data: tenseItems
            }
        }
    }
};

export default useTenseStore;