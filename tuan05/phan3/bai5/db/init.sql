CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  vote VARCHAR(255) NOT NULL,
  voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS results (
  option VARCHAR(255) PRIMARY KEY,
  count INTEGER DEFAULT 0
);

-- Initialize with options
INSERT INTO results (option, count) VALUES
  ('java', 0),
  ('python', 0),
  ('node.js', 0)
ON CONFLICT (option) DO NOTHING;
