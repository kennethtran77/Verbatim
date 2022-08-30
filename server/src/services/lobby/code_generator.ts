export type GameCodeGenerator = (isCodeTaken: (code: string) => boolean) => GameCodeGeneratorService;

/** Generates a unique game code.
 * @returns a random game code
 */
export type GameCodeGeneratorService = () => string;

const useGameCodeGenerator: GameCodeGenerator = (isCodeTaken) => {
    return () => {
        const codeGenerator = () => (Math.random() + 1).toString(36).substring(7).toUpperCase();

        let code = codeGenerator();

        while (isCodeTaken(code)) {
            code = codeGenerator();
        }

        return code;
    }
}

export default useGameCodeGenerator;