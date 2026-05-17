import { describe, it, expect } from 'vitest';
import createPostgresGameRepository from '../../../src/features/game/adapters/postgres';
import { Game } from '../../../src/features/game/models/game';
import { EventEmitterService } from '../../../src/ports/event_emitter';
import { getTestPool } from '../../helpers/test_db';

const noopEmitter: EventEmitterService = { emit: () => {} };

function buildGame(code: string): Game {
    const game = new Game(noopEmitter, code, {
        mode: 'conjugation-race',
        tenses: [
            { display: 'Indicatif Présent', value: 'PRESENT' },
            { display: 'Impératif Présent', value: 'IMPERATIF_PRESENT' },
        ],
        duration: { minutes: 1, seconds: 30 },
        maxPlayers: 4,
    });
    game.state = 'ending';
    game.startTime = new Date('2026-01-01T00:00:00Z');
    game.endTime = new Date('2026-01-01T00:01:30Z');
    return game;
}

describe('PostgresGameRepository', () => {
    const pool = getTestPool();
    const repo = createPostgresGameRepository(pool);

    it('returns null for an unknown game code', async () => {
        const result = await repo.getGameData('ZZZZZ');
        expect(result).toBeNull();
    });

    it('persists a game and reads back its core fields', async () => {
        const game = buildGame('ABC123');
        await repo.saveGameData(game);

        const data = await repo.getGameData('ABC123');
        expect(data).not.toBeNull();
        expect(data!.code).toBe('ABC123');
        expect(data!.mode).toBe('conjugation-race');
        expect(data!.maxPlayers).toBe(4);
        expect(data!.duration).toEqual({ minutes: 1, seconds: 30 });
        expect(data!.startTime).toEqual(game.startTime);
        expect(data!.endTime).toEqual(game.endTime);
    });

    it('persists every tense associated with the game', async () => {
        const game = buildGame('TENSES');
        await repo.saveGameData(game);

        const data = await repo.getGameData('TENSES');
        expect(data!.tenses).toHaveLength(2);
        expect(data!.tenses).toEqual(expect.arrayContaining(['PRESENT', 'IMPERATIF_PRESENT']));
    });

    it('maintains separate data for each game', async () => {
        const a = buildGame('AAAAA');
        const b = buildGame('BBBBB');
        b.settings.maxPlayers = 8;
        await repo.saveGameData(a);
        await repo.saveGameData(b);

        const dataA = await repo.getGameData('AAAAA');
        const dataB = await repo.getGameData('BBBBB');
        expect(dataA!.maxPlayers).toBe(4);
        expect(dataB!.maxPlayers).toBe(8);
    });
});
