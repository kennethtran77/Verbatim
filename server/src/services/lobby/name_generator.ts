export type UsernameGenerator = (names: string[]) => UsernameGeneratorService;

/**
 * Generates a random username
 * @returns a random name
 */
export type UsernameGeneratorService = () => string;

const useUsernameGenerator: UsernameGenerator = (names: string[]) => {
    return () => {
        const pick = (): string => names[Math.floor(Math.random() * names.length)];
        const randomInt = (): number => Math.floor(Math.random() * 1000);

        return pick() + randomInt();
    }
}

export default useUsernameGenerator;