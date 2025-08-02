# -*- coding: utf-8 -*-
"""
宿命司后端代码骨架 (Python + Flask)
这是一个基础的 Flask 应用，包含了与前端原型对接的 API 路由。
它实现了用户数据获取、生成任务提交和结果查询等功能。
"""
import os
import time
import random
import datetime
import sqlite3
from flask import Flask, jsonify, request, g
from flask_cors import CORS
# JWT相关导入已移除，因为不再需要登录功能
# import jwt
# import datetime
# from functools import wraps

# 初始化 Flask 应用
app = Flask(__name__)

# 配置 CORS，限制来源为前端域名
# 在开发环境中可以使用 *，生产环境应限制具体域名
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "https://your-frontend-domain.com"]}})

# 不再需要JWT密钥
# app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')

# 导入用户管理器
from .user_manager import UserManager

# 初始化数据库表
UserManager.init_db(app)

# 创建生成任务表
with app.app_context():
    db = UserManager.get_db()
    cursor = db.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS generation_tasks (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            status TEXT DEFAULT 'PROCESSING',
            result TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            birth_date TEXT,
            birth_time TEXT,
            birth_place TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    db.commit()

# 导入支付配置
from .payment_config import WECHAT_PAY_CONFIG, PAYMENT_AMOUNTS

# 微信支付API相关辅助函数
import hashlib
import xml.etree.ElementTree as ET
import time
import requests

def generate_sign(params, api_key):
    """生成微信支付签名"""
    # 按照参数名ASCII码从小到大排序
    sorted_params = sorted(params.items(), key=lambda x: x[0])
    # 拼接参数
    sign_str = '&'.join([f'{k}={v}' for k, v in sorted_params]) + f'&key={api_key}'
    # MD5加密
    sign = hashlib.md5(sign_str.encode('utf-8')).hexdigest().upper()
    return sign

def dict_to_xml(params):
    """将字典转换为XML"""
    xml = '<xml>'
    for k, v in params.items():
        xml += f'<{k}>{v}</{k}>'
    xml += '</xml>'
    return xml

def xml_to_dict(xml_str):
    """将XML转换为字典"""
    xml = ET.fromstring(xml_str)
    params = {child.tag: child.text for child in xml}
    return params

# 导入图像生成器
from .image_generator import ImageGenerator

# 辅助函数：根据 birthDate、birthTime 和 birthPlace 生成正缘画像
def generate_real_result(birth_date, birth_time, birth_place):
    """
    根据输入的出生信息生成真实的 AI 正缘画像结果。
    调用玄学算法和 AI 图像生成模型生成结果。
    """
    # 这里可以根据出生信息生成更精准的提示词
    # 简单示例：根据出生时间和地点生成不同的提示词元素
    time_of_day = "清晨" if int(birth_time.split(':')[0]) < 12 else "黄昏"
    season = "春季"  # 这里可以根据出生月份进一步细化
    
    # 生成正缘画像提示词（示例）
    gender_prompt = "一位英俊的男子"  # 可以根据命理算法确定性别
    appearance_prompt = "五官端正，气质优雅，眼神温和"
    background_prompt = f"在{season}{time_of_day}的{birth_place}，背景有山水元素"
    style_prompt = "中国传统绘画风格，工笔重彩"
    
    full_prompt = f"{gender_prompt}，{appearance_prompt}，{background_prompt}，{style_prompt}"
    
    # 调用图像生成API
    image_filename = ImageGenerator.generate_image(full_prompt)
    
    # 如果图像生成失败，使用备用方案
    if not image_filename:
        # 可以使用占位图或返回错误信息
        image_url = "https://placehold.co/400x600/6b7280/ffffff?text=画像生成中"
    else:
        # 生成图像URL
        image_url = f"/generated_images/{image_filename}"
    
    # 生成诗意文字（这里可以接入诗歌生成API）
    poetic_text = "心有灵犀一点通，有缘千里来相会"
    
    # 生成详细分析（这里可以接入命理分析API）
    detailed_analysis = (
        f"根据您的出生信息 ({birth_date}, {birth_time}, {birth_place})，您的正缘画像为：\n\n"
        f"此人性格开朗，热情大方，善于沟通，事业上积极进取。\n"
        f"在感情方面，重视家庭，体贴入微，是理想的伴侣。\n"
        f"建议您在{season}多参加社交活动，可能会遇到心仪的对象。"
    )

    return {
        "hdImage": image_url,
        "poeticText": poetic_text,
        "detailedAnalysis": detailed_analysis,
    }

# ----------------------------------------------------------------------
# API 路由
# ----------------------------------------------------------------------

@app.route('/api/v1/users/<user_id>', methods=['GET'])
def get_user_data(user_id):
    """
    获取用户的免费机会和最近分享时间。
    """
    # 使用UserManager获取用户数据
    user = UserManager.get_user(user_id)

    if not user:
        # 如果用户不存在，创建新用户
        UserManager.create_user(user_id)
        return jsonify({'free_chances': 1, 'last_shared_at': None}), 200

    # 格式化日期时间
    last_shared_at = user['last_shared_at']
    if last_shared_at:
        import datetime
        last_shared_at = datetime.datetime.fromtimestamp(float(last_shared_at)).isoformat()

    return jsonify({
        'free_chances': user['free_chances'],
        'last_shared_at': last_shared_at
    }), 200

# 登录接口已移除，因为不再需要登录功能
# @app.route('/api/v1/auth/login', methods=['POST'])
# def login():
#     """
#     用户登录接口，返回JWT令牌
#     """
#     auth = request.json
#     if not auth or not auth.get('user_id'):
#         return jsonify({'message': 'Invalid credentials!'}), 401
#
#     user_id = auth['user_id']
#
#     # 检查用户是否存在，不存在则创建
#     db = get_db()
#     cursor = db.cursor()
#     cursor.execute('SELECT id FROM users WHERE id = ?', (user_id,))
#     user = cursor.fetchone()
#     if not user:
#         cursor.execute('INSERT INTO users (id) VALUES (?)', (user_id,))
#         db.commit()
#
#     # 生成JWT令牌
#     token = jwt.encode({
#         'user_id': user_id,
#         'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
#     }, app.config['SECRET_KEY'])
#
#     return jsonify({'token': token}), 200

@app.route('/api/v1/generate/submit', methods=['POST'])
def submit_generation_task():
    """
    提交一个生成任务，异步处理。
    """
    data = request.json
    birth_date = data.get('birthDate')
    birth_time = data.get('birthTime')
    birth_place = data.get('birthPlace')
    
    # 为简化实现，使用固定用户ID
    user_id = 'anonymous_user'
    
    if not all([birth_date, birth_time, birth_place]):
        return jsonify({"error": "缺少必要的出生信息。"}), 400
    
    # 检查用户是否有免费机会
    user = UserManager.get_user(user_id)
    
    if not user:
        # 如果用户不存在，创建新用户
        UserManager.create_user(user_id)
        user = {'free_chances': 1}
    
    if user['free_chances'] <= 0:
        # 用户没有免费机会，需要付费
        return jsonify({
            "error": "免费机会已用完，请购买更多机会。",
            "need_payment": True
        }), 402
    
    # 创建任务ID
    task_id = os.urandom(16).hex()
    
    # 保存任务到数据库
    with app.app_context():
        db = UserManager.get_db()
        cursor = db.cursor()
        created_at = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute('''
            INSERT INTO generation_tasks (id, user_id, birth_date, birth_time, birth_place, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (task_id, user_id, birth_date, birth_time, birth_place, created_at))
        db.commit()
    
    # 减少用户免费机会
    UserManager.update_free_chances(user_id, user['free_chances'] - 1)
    
    # 异步处理生成任务
    import threading
    def run_generation_async():
        try:
            # 生成结果
            real_result = generate_real_result(birth_date, birth_time, birth_place)
            result_json = str(real_result).replace("'", '"')
            
            # 更新任务状态和结果
            with app.app_context():
                db = UserManager.get_db()
                cursor = db.cursor()
                cursor.execute('''
                    UPDATE generation_tasks
                    SET status = 'SUCCESS', result = ?
                    WHERE id = ?
                ''', (result_json, task_id))
                db.commit()
        except Exception as e:
            print(f"Error in async task: {e}")
            with app.app_context():
                db = UserManager.get_db()
                cursor = db.cursor()
                cursor.execute('''
                    UPDATE generation_tasks
                    SET status = 'FAILED', result = ?
                    WHERE id = ?
                ''', (str(e), task_id))
                db.commit()
    
    # 启动异步线程
    thread = threading.Thread(target=run_generation_async)
    thread.daemon = True
    thread.start()
    
    return jsonify({"taskId": task_id}), 200

@app.route('/api/v1/payment/create', methods=['POST'])
def create_payment():
    """
    创建微信支付订单
    """
    data = request.json
    # 获取商品类型 (默认单次求缘)
    product_type = data.get('product_type', 'single')
    # 根据商品类型获取金额
    amount = PAYMENT_AMOUNTS.get(product_type, PAYMENT_AMOUNTS['single'])
    # 金额转换为分
    total_fee = int(amount * 100)
    
    # 为简化实现，使用固定用户ID
    user_id = 'anonymous_user'
    
    # 检查用户是否存在
    user = UserManager.get_user(user_id)
    if not user:
        UserManager.create_user(user_id)
    
    # 生成订单号 (用户ID + 时间戳 + 随机字符串)
    import uuid
    out_trade_no = f"{user_id}_{int(time.time())}_{uuid.uuid4().hex[:6]}"
    
    # 构建请求参数
    params = {
        'appid': WECHAT_PAY_CONFIG['APP_ID'],
        'mch_id': WECHAT_PAY_CONFIG['MCH_ID'],
        'nonce_str': uuid.uuid4().hex,
        'body': f'购买{product_type}求缘机会',
        'out_trade_no': out_trade_no,
        'total_fee': total_fee,
        'spbill_create_ip': request.remote_addr,
        'notify_url': WECHAT_PAY_CONFIG['NOTIFY_URL'],
        'trade_type': 'JSAPI',
        'openid': data.get('openid', 'test_openid')  # 从请求中获取openid，默认使用测试openid
    }
    
    # 生成签名
    sign = generate_sign(params, WECHAT_PAY_CONFIG['API_KEY'])
    params['sign'] = sign
    
    # 转换为XML
    xml_data = dict_to_xml(params)
    
    try:
        # 调用微信支付统一下单API
        response = requests.post(
            'https://api.mch.weixin.qq.com/pay/unifiedorder',
            data=xml_data.encode('utf-8'),
            headers={'Content-Type': 'text/xml'}
        )
        
        # 解析XML响应
        response_xml = response.content
        result = xml_to_dict(response_xml)
        
        if result.get('return_code') == 'SUCCESS' and result.get('result_code') == 'SUCCESS':
            # 构造JSAPI支付参数
            jsapi_params = {
                'appId': WECHAT_PAY_CONFIG['APP_ID'],
                'timeStamp': str(int(time.time())),
                'nonceStr': uuid.uuid4().hex,
                'package': f"prepay_id={result['prepay_id']}",
                'signType': 'MD5'
            }
            # 生成签名
            jsapi_sign = generate_sign(jsapi_params, WECHAT_PAY_CONFIG['API_KEY'])
            jsapi_params['paySign'] = jsapi_sign
            
            # 记录订单信息到数据库
            with app.app_context():
                db = UserManager.get_db()
                cursor = db.cursor()
                created_at = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                cursor.execute('''
                    INSERT INTO payment_orders (order_id, user_id, product_type, amount, status)
                    VALUES (?, ?, ?, ?, ?)
                ''', (out_trade_no, user_id, product_type, amount, 'PENDING'))
                db.commit()
            
            return jsonify({
                'order_id': out_trade_no,
                'jsapi_params': jsapi_params
            }), 200
        else:
            error_msg = result.get('err_code_des', '创建支付订单失败')
            logger.error(f"WeChat payment error: {error_msg}")
            return jsonify({'error': error_msg}), 500
    except Exception as e:
        logger.error(f"Payment error: {str(e)}")
        return jsonify({'error': '支付系统暂时不可用'}), 503

@app.route('/api/v1/payment/callback', methods=['POST'])
def payment_callback():
    """
    微信支付回调接口
    """
    # 读取XML数据
    xml_data = request.data
    result = xml_to_dict(xml_data)
    
    # 验证签名
    sign = result.pop('sign')
    generated_sign = generate_sign(result, WECHAT_PAY_CONFIG['API_KEY'])
    
    if sign != generated_sign:
        logger.warning("微信支付回调签名验证失败")
        return '签名失败', 400
    
    if result.get('return_code') == 'SUCCESS':
        if result.get('result_code') == 'SUCCESS':
            # 支付成功
            out_trade_no = result['out_trade_no']
            
            # 从数据库查询订单信息获取用户ID
            with app.app_context():
                db = UserManager.get_db()
                cursor = db.cursor()
                cursor.execute('SELECT user_id, product_type FROM payment_orders WHERE order_id = ?', (out_trade_no,))
                order = cursor.fetchone()
                
                if order:
                    user_id = order['user_id']
                    product_type = order['product_type']
                    
                    # 根据商品类型增加相应的免费机会
                    if product_type == 'single':
                        chances = 1
                    elif product_type == 'monthly':
                        chances = 10
                    elif product_type == 'yearly':
                        chances = 100
                    else:
                        chances = 1
                    
                    # 更新用户免费机会
                    user = UserManager.get_user(user_id)
                    if user:
                        new_chances = user['free_chances'] + chances
                        UserManager.update_free_chances(user_id, new_chances)
                        logger.info(f"用户 {user_id} 购买{product_type}成功，增加 {chances} 次免费机会")
                    
                    # 更新订单状态
                    cursor.execute('UPDATE payment_orders SET status = ? WHERE order_id = ?', ('SUCCESS', out_trade_no))
                    db.commit()
                else:
                    logger.error(f"订单 {out_trade_no} 不存在")
        else:
            # 支付失败
            out_trade_no = result.get('out_trade_no', '')
            error_msg = result.get('err_code_des', '支付失败')
            logger.error(f"支付失败: {out_trade_no}, {error_msg}")
            
            # 更新订单状态
            if out_trade_no:
                with app.app_context():
                    db = UserManager.get_db()
                    cursor = db.cursor()
                    cursor.execute('UPDATE payment_orders SET status = ?, error_msg = ? WHERE order_id = ?', ('FAILED', error_msg, out_trade_no))
                    db.commit()
    
    # 更新支付记录
    with app.app_context():
        db = UserManager.get_db()
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO payment_records (order_id, user_id, amount, status, error_msg)
            VALUES (?, ?, ?, ?, ?)
        ''', (out_trade_no, user_id, int(result.get('total_fee', 0))/100, 'FAILED', error_msg))
        db.commit()

    # 返回成功响应给微信服务器
    return '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>'
    
    # 回复微信服务器
    return '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>'

@app.route('/api/v1/generate/status/<task_id>', methods=['GET'])
def get_generation_status(task_id):
    """
    查询生成任务的当前状态。
    """
    with app.app_context():
        db = UserManager.get_db()
        cursor = db.cursor()
        cursor.execute('''
            SELECT status FROM generation_tasks WHERE id = ?
        ''', (task_id,))
    task = cursor.fetchone()
    
    if not task:
        return jsonify({"error": "任务不存在。"}), 404
        
    return jsonify({"status": task["status"]}), 200
    
@app.route('/api/v1/results/<task_id>', methods=['GET'])
def get_generation_result(task_id):
    """
    获取最终的生成结果。
    """
    with app.app_context():
        db = UserManager.get_db()
        cursor = db.cursor()
        cursor.execute('''
            SELECT status, result FROM generation_tasks WHERE id = ?
        ''', (task_id,))
    task = cursor.fetchone()
    
    if not task:
        return jsonify({"error": "任务不存在。"}), 404
        
    if task["status"] != "SUCCESS":
        return jsonify({"error": "结果尚未生成。"}), 400
        
    # 解析JSON结果
    import json
    try:
        result = json.loads(task["result"]) if task["result"] else {}
    except json.JSONDecodeError:
        result = {}
        
    return jsonify(result), 200

if __name__ == '__main__':
    # 直接启动Flask应用
    app.run(debug=True, host='127.0.0.1', port=5000)
