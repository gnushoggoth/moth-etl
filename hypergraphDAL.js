const pool = require('./db');

// Insert or update an entity.
async function upsertEntity(entityId, entityType, data = {}) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO entities (entity_id, entity_type, data)
      VALUES ($1, $2, $3)
      ON CONFLICT (entity_id) DO UPDATE
        SET entity_type = EXCLUDED.entity_type,
            data = EXCLUDED.data
      RETURNING *;
    `;
    const values = [entityId, entityType, data];
    const res = await client.query(query, values);
    return res.rows[0];
  } finally {
    client.release();
  }
}

// Create a new delta.
async function createDelta(deltaType, targetEntity, context = [], deltaData = {}) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO deltas (delta_type, target_entity, context, data)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [deltaType, targetEntity, context, deltaData];
    const res = await client.query(query, values);
    return res.rows[0];
  } finally {
    client.release();
  }
}

// Retrieve all deltas for a given entity.
async function getDeltasForEntity(entityId) {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * FROM deltas
      WHERE target_entity = $1
      ORDER BY delta_timestamp ASC;
    `;
    const { rows } = await client.query(query, [entityId]);
    return rows;
  } finally {
    client.release();
  }
}

// Reconstruct final state of an entity from its base 'data' plus deltas.
async function getCurrentStateOfEntity(entityId) {
  const client = await pool.connect();
  try {
    const entityRes = await client.query(
      'SELECT data FROM entities WHERE entity_id = $1',
      [entityId]
    );
    if (entityRes.rowCount === 0) {
      return null; // or throw new Error("Entity not found");
    }
    let finalData = entityRes.rows[0].data;

    const deltasRes = await client.query(
      `
      SELECT * FROM deltas
      WHERE target_entity = $1
      ORDER BY delta_timestamp ASC;
      `,
      [entityId]
    );

    for (const delta of deltasRes.rows) {
      switch (delta.delta_type) {
        case 'friend':
          finalData.friends = finalData.friends || [];
          if (!finalData.friends.includes(delta.data.friendId)) {
            finalData.friends.push(delta.data.friendId);
          }
          break;
        case 'deposit':
          finalData.balance = (finalData.balance || 0) + (delta.data.amount || 0);
          break;
        default:
          finalData.events = finalData.events || [];
          finalData.events.push({
            type: delta.delta_type,
            data: delta.data,
            context: delta.context
          });
          break;
      }
    }

    return finalData;
  } finally {
    client.release();
  }
}

module.exports = {
  upsertEntity,
  createDelta,
  getDeltasForEntity,
  getCurrentStateOfEntity
};
