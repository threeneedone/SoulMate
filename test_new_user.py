import sqlite3
import uuid

# 生成新的用户ID
new_user_id = f'user_{uuid.uuid4().hex[:12]}'
print(f'生成新用户ID: {new_user_id}')

# 连接到数据库
conn = sqlite3.connect('soulmate.db')
cursor = conn.cursor()

# 插入新用户
cursor.execute('INSERT INTO users (id, free_chances) VALUES (?, 1)', (new_user_id,))
conn.commit()
print('新用户已创建')

# 查询新用户的免费机会
cursor.execute('SELECT free_chances FROM users WHERE id = ?', (new_user_id,))
result = cursor.fetchone()
if result:
    print(f'新用户免费机会: {result[0]}')
else:
    print('未找到新用户')

# 关闭连接
cursor.close()
conn.close()