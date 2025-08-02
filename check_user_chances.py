import sqlite3

# 连接到数据库
conn = sqlite3.connect('soulmate.db')
cursor = conn.cursor()

# 查询用户表中的free_chances字段
print('查询用户免费机会数据:')
cursor.execute('SELECT id, free_chances FROM users LIMIT 10')
users = cursor.fetchall()

if not users:
    print('没有找到用户数据')
else:
    for user in users:
        print(f'用户ID: {user[0]}, 免费机会: {user[1]}')

# 关闭连接
cursor.close()
conn.close()