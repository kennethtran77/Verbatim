import { CSSProperties } from "react";
import Toggle from "../../components/Toggle/Toggle";

export type TenseFormProps = {
    labelStyle: CSSProperties;
};

const TenseForm = ({ labelStyle }: TenseFormProps) => {
    return (
        <>
            {/* <label style={labelStyle}>Tenses</label>
            <div className="flex gap">
                <div className="flex-column gap">
                    <label>Indicatif</label>
                    <Toggle
                        label="Présent"
                        title="indicatif-present"
                        checked={tenses['indicatif-present']}
                        onChange={handleToggleTense}
                    />
                    <Toggle
                        label="Passé Composé"
                        title="indicatif-passe-compose"
                        checked={tenses['indicatif-passe-compose']}
                        onChange={handleToggleTense}
                    />
                </div>
                <div className="flex-column gap">
                    <label>Subjonctif</label>
                    <Toggle
                        label="Présent"
                        title="subjonctif-present"
                        checked={tenses['subjonctif-present']}
                        onChange={handleToggleTense}
                    />
                    <Toggle
                        label="Imparfait"
                        title="subjonctif-imparfait"
                        checked={tenses['subjonctif-imparfait']}
                        onChange={handleToggleTense}
                    />
                </div>
                <div className="flex-column gap">
                    <label>Impératif</label>
                    <Toggle
                        label="Présent"
                        title="imperatif-present"
                        checked={tenses['imperatif-present']}
                        onChange={handleToggleTense}
                    />
                </div>
            </div> */}
        </>
    );
};

export default TenseForm;