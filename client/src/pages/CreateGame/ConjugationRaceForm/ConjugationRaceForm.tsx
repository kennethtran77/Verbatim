import { ChangeEvent, CSSProperties } from "react";
import { Duration } from "../../../../../server/src/models/game";
import Input from "../../../components/Input/Input";
import Toggle, { ToggleChangeEvent } from "../../../components/Toggle/Toggle";
import { TenseValue } from "../../../models/tenses";

export type Tenses = {
    [key in TenseValue]: boolean;
};

export interface ConjugationRaceFormProps {
    labelStyle?: CSSProperties;
    gametime: Duration;
    handleGameTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleToggleTense: (e: ToggleChangeEvent) => void;
    tenses: Tenses;
}

const ConjugationRaceForm = ({ labelStyle, gametime, handleGameTimeChange, handleToggleTense, tenses }: ConjugationRaceFormProps) => {
    return (
        <>
            <label style={labelStyle}>Game Time</label>
            <div className="flex gap align-items-center">
                <Input
                    label="Minutes"
                    title="minutes"
                    type="number"
                    min="0"
                    max="4"
                    value={gametime.minutes}
                    breakLine={false}
                    onChange={handleGameTimeChange}
                />
                <Input
                    label="Seconds"
                    title="seconds"
                    type="number"
                    min="0"
                    max="59"
                    breakLine={false}
                    value={gametime.seconds}
                    onChange={handleGameTimeChange}
                />
            </div>
            <label style={labelStyle}>Tenses</label>
            <div className="space-between gap">
                <div className="flex-column gap">
                    <label>Indicatif</label>
                    <Toggle
                        label="Présent"
                        title="PRESENT"
                        checked={tenses['PRESENT']}
                        onChange={handleToggleTense}
                    />
                    <Toggle
                        label="Passé Composé"
                        title="PASSE_COMPOSE"
                        checked={tenses['PASSE_COMPOSE']}
                        onChange={handleToggleTense}
                    />
                    <Toggle
                        label="Imparfait"
                        title="IMPARFAIT"
                        checked={tenses['IMPARFAIT']}
                        onChange={handleToggleTense}
                    />
                    <Toggle
                        label="Passé Simple"
                        title="PASSE_SIMPLE"
                        checked={tenses['PASSE_SIMPLE']}
                        onChange={handleToggleTense}
                    />
                    <Toggle
                        label="Plus-Que-Parfait"
                        title="PLUS_QUE_PARFAIT"
                        checked={tenses['PLUS_QUE_PARFAIT']}
                        onChange={handleToggleTense}
                    />
                </div>
                <div className="flex-column gap">
                    <label>Conditionnel</label>
                    <Toggle
                        label="Présent"
                        title="CONDITIONNEL_PRESENT"
                        checked={tenses['CONDITIONNEL_PRESENT']}
                        onChange={handleToggleTense}
                    />
                </div>
                <div className="flex-column gap">
                    <label>Subjonctif</label>
                    <Toggle
                        label="Présent"
                        title="SUBJONCTIF_PRESENT"
                        checked={tenses['SUBJONCTIF_PRESENT']}
                        onChange={handleToggleTense}
                    />
                    <Toggle
                        label="Imparfait"
                        title="SUBJONCTIF_IMPARFAIT"
                        checked={tenses['SUBJONCTIF_IMPARFAIT']}
                        onChange={handleToggleTense}
                    />
                </div>
                <div className="flex-column gap">
                    <label>Impératif</label>
                    <Toggle
                        label="Présent"
                        title="IMPERATIF_PRESENT"
                        checked={tenses['IMPERATIF_PRESENT']}
                        onChange={handleToggleTense}
                    />
                </div>
            </div>
        </>
    );
};

export default ConjugationRaceForm;