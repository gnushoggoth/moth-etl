CREATE TABLE IF NOT EXISTS entities (
  entity_id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  data JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS deltas (
  delta_id SERIAL PRIMARY KEY,
  delta_type TEXT NOT NULL,
  target_entity TEXT NOT NULL,
  delta_timestamp TIMESTAMPTZ DEFAULT NOW(),
  context TEXT[] DEFAULT '{}',
  data JSONB DEFAULT '{}',

  CONSTRAINT fk_target_entity
    FOREIGN KEY(target_entity) 
    REFERENCES entities(entity_id)
    ON DELETE CASCADE
);
