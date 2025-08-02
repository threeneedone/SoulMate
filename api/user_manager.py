import sqlite3
import time
import logging
from flask import g
import contextlib

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
    @contextlib.contextmanager
    def get_db_cursor():
        db = UserManager.get_db()
        cursor = db.cursor()
        try:
            yield cursor
            db.commit()
        except Exception as e:
            db.rollback()
            raise e
        finally:
            cursor.close()

    @staticmethod
    def init_db(app):
        with app.app_context():
            with UserManager.get_db_cursor() as cursor:
                # 创建用户表
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS users (
                        id TEXT PRIMARY KEY,
                        free_chances INTEGER DEFAULT 1,
                        last_shared_at TIMESTAMP,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ''')

    @staticmethod
    def get_user(user_id):
        try:
            with UserManager.get_db_cursor() as cursor:
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
            with UserManager.get_db_cursor() as cursor:
                cursor.execute('INSERT INTO users (id, free_chances) VALUES (?, 1)', (user_id,))
            return True
        except Exception as e:
            logger.error(f"创建用户失败: {str(e)}")
            return False

    @staticmethod
    def update_free_chances(user_id, chances):
        try:
            with UserManager.get_db_cursor() as cursor:
                cursor.execute('UPDATE users SET free_chances = ? WHERE id = ?', (chances, user_id))
            return True
        except Exception as e:
            logger.error(f"更新免费次数失败: {str(e)}")
            return False

    @staticmethod
    def update_last_shared(user_id):
        try:
            with UserManager.get_db_cursor() as cursor:
                cursor.execute('UPDATE users SET last_shared_at = ? WHERE id = ?', (time.time(), user_id))
            return True
        except Exception as e:
            logger.error(f"更新最后分享时间失败: {str(e)}")
            return False