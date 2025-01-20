import psycopg2

def get_sequential_data_for_entity(conn, entity_id):
    """
    Return a sequence of (delta_type, data, context) in chronological order for the entity.
    Great for feeding into an RNN or Transformer as a sequence.
    """
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT delta_type, data, context
            FROM deltas
            WHERE target_entity = %s
            ORDER BY delta_timestamp ASC;
        """, (entity_id,))
        rows = cursor.fetchall()
        return rows
    finally:
        cursor.close()

if __name__ == "__main__":
    conn = psycopg2.connect(
        dbname='mydb',
        user='myuser',
        password='mypassword',
        host='localhost'
    )

    mu_sequence = get_sequential_data_for_entity(conn, 'mu')
    epsilon_sequence = get_sequential_data_for_entity(conn, 'epsilon')

    print("Sequence for mu:", mu_sequence)
    print("Sequence for epsilon:", epsilon_sequence)


    conn.close()
