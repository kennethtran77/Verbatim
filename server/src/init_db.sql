CREATE TABLE IF NOT EXISTS game (
    code VARCHAR(20) PRIMARY KEY,
    mode VARCHAR(20),
    max_players INTEGER,
    duration INTEGER,
    game_state VARCHAR(20),
    start_time TIMESTAMP,
    end_time TIMESTAMP
);

-- one-to-one with game
CREATE TABLE IF NOT EXISTS conjugation_race_game (
    code VARCHAR(20) PRIMARY KEY,
    FOREIGN KEY (code) REFERENCES game(code)
);

-- many-to-one with game
CREATE TABLE IF NOT EXISTS tense (
    tense VARCHAR(20),
    game_code VARCHAR(20),
    PRIMARY KEY (tense, game_code),
    FOREIGN KEY (game_code) REFERENCES game(code)
);

-- many-to-one with conjugation_race_game
CREATE TABLE IF NOT EXISTS verb (
    id INTEGER,
    infinitive VARCHAR(20),
    tense VARCHAR(20),
    subject VARCHAR(20),
    pronominal BOOLEAN,
    game_code VARCHAR(20),
    PRIMARY KEY (id, game_code),
    FOREIGN KEY (game_code) REFERENCES conjugation_race_game(code)
);

CREATE TABLE IF NOT EXISTS conjugation_race_player (
    id VARCHAR(20),
    username VARCHAR(20),
    verbs_seen INTEGER CHECK (verbs_seen >= 0),
    game_code VARCHAR(20),
    PRIMARY KEY (id, game_code),
    FOREIGN KEY (game_code) REFERENCES conjugation_race_game(code)
);

-- many-to-one with conjugation_race_player
CREATE TABLE IF NOT EXISTS verb_response (
    player_id VARCHAR(20),
    game_code VARCHAR(20),
    verb_id INTEGER,
    input VARCHAR(20),
    correct_answer VARCHAR(20),
    is_input_correct BOOLEAN,
    answer_time TIMESTAMP,
    PRIMARY KEY (player_id, game_code, verb_id),
    FOREIGN KEY (player_id, game_code) REFERENCES conjugation_race_player(id, game_code),
    FOREIGN KEY (verb_id, game_code) REFERENCES verb(id, game_code)
);
