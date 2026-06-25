import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''
    API для управления товарами (двери): получение, добавление, обновление и удаление.
    Поддерживает методы GET (список), POST (создать), PUT (обновить), DELETE (удалить).
    '''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    try:
        if method == 'GET':
            cur.execute('SELECT id, name, type, material, price, width, height, img FROM doors ORDER BY id')
            rows = cur.fetchall()
            doors = [
                {'id': r[0], 'name': r[1], 'type': r[2], 'material': r[3],
                 'price': r[4], 'width': r[5], 'height': r[6], 'img': r[7]}
                for r in rows
            ]
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps(doors, ensure_ascii=False)}

        if method == 'POST':
            b = json.loads(event.get('body') or '{}')
            name = b['name'].replace("'", "''")
            dtype = b['type'].replace("'", "''")
            material = b['material'].replace("'", "''")
            img = b['img'].replace("'", "''")
            price = int(b['price'])
            width = int(b['width'])
            height = int(b['height'])
            cur.execute(
                f"INSERT INTO doors (name, type, material, price, width, height, img) "
                f"VALUES ('{name}', '{dtype}', '{material}', {price}, {width}, {height}, '{img}') RETURNING id"
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'id': new_id})}

        if method == 'PUT':
            b = json.loads(event.get('body') or '{}')
            door_id = int(b['id'])
            name = b['name'].replace("'", "''")
            dtype = b['type'].replace("'", "''")
            material = b['material'].replace("'", "''")
            img = b['img'].replace("'", "''")
            price = int(b['price'])
            width = int(b['width'])
            height = int(b['height'])
            cur.execute(
                f"UPDATE doors SET name='{name}', type='{dtype}', material='{material}', "
                f"price={price}, width={width}, height={height}, img='{img}' WHERE id={door_id}"
            )
            conn.commit()
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

        if method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            door_id = int(params.get('id', 0))
            cur.execute(f"DELETE FROM doors WHERE id={door_id}")
            conn.commit()
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

        return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}
    finally:
        cur.close()
        conn.close()
