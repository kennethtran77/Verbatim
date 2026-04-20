export type GameCodeGenerator = (isCodeTaken: (code: string) => boolean) => GameCodeGeneratorService;

/** Generates a unique game code.
 * @returns a random game code
 */
export type GameCodeGeneratorService = () => string;

const createGameCodeGenerator: GameCodeGenerator = (isCodeTaken) => {
    return () => {
        const codeLength = 8;
        const codeGenerator = () => (Math.random() + 1).toString(36).substring(codeLength).toUpperCase();

        let code = codeGenerator();

        while (isCodeTaken(code)) {
            code = codeGenerator();
        }

        return code;
    }
}

export default createGameCodeGenerator;