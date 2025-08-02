import sqlite3
import time
import logging
from flask import g

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UserManager:
    @staticmethod
    def get_db():
        db = getattr(g, '_database', None)
        if db is None:
            db = g._database = sqlite3.connect('soulmate.db')
            db.row_factory = sqlite3.Row
        return db

    @staticmethod
    def init_db(app):
        with app.app_context():
            db = UserManager.get_db()
            cursor = db.cursor()
            # 创建用户表
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    free_chances INTEGER DEFAULT 1,
                    last_shared_at TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            db.commit()

    @staticmethod
    def get_user(user_id):
        try:
            db = UserManager.get_db()
            cursor = db.cursor()
            cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
            user = cursor.fetchone()
            if user:
                return dict(user)
            return None
        except Exception as e:
            logger.error(f"获取用户信息失败: {str(e)}")
            return None

    @staticmethod
    def create_user(user_id):
        try:
            db = UserManager.get_db()
            cursor = db.cursor()
            cursor.execute('INSERT INTO users (id) VALUES (?)', (user_id,))
            db.commit()
            return True
        except Exception as e:
            logger.error(f"创建用户失败: {str(e)}")
            return False

    @staticmethod
    def update_free_chances(user_id, chances):
        try:
            db = UserManager.get_db()
            cursor = db.cursor()
            cursor.execute('UPDATE users SET free_chances = ? WHERE id = ?', (chances, user_id))
            db.commit()
            return True
        except Exception as e:
            logger.error(f"更新免费次数失败: {str(e)}")
            return False

    @staticmethod
    def update_last_shared(user_id):
        try:
            db = UserManager.get_db()
            cursor = db.cursor()
            cursor.execute('UPDATE users SET last_shared_at = ? WHERE id = ?', (time.time(), user_id))
            db.commit()
            return True
        except Exception as e:
            logger.error(f"更新最后分享时间失败: {str(e)}")
            return False