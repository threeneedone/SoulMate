# -*- coding: utf-8 -*-
"""
支付配置文件
存储微信支付等支付方式的相关配置
"""
import os

# 微信支付配置
WECHAT_PAY_CONFIG = {
    'APP_ID': os.environ.get('WECHAT_APP_ID', 'your-wechat-app-id'),  # 微信公众号APPID
    'MCH_ID': os.environ.get('WECHAT_MCH_ID', 'your-mch-id'),  # 商户号
    'API_KEY': os.environ.get('WECHAT_API_KEY', 'your-api-key'),  # API密钥
    'NOTIFY_URL': os.environ.get('WECHAT_NOTIFY_URL', 'https://your-domain.com/api/v1/payment/callback'),  # 支付回调URL
    'CERT_PATH': os.environ.get('WECHAT_CERT_PATH', 'path/to/cert.pem'),  # 证书路径
    'KEY_PATH': os.environ.get('WECHAT_KEY_PATH', 'path/to/key.pem'),  # 密钥路径
}

# 支付金额配置 (单位: 元)
PAYMENT_AMOUNTS = {
    'single': 28.8,  # 单次求缘机会
    'monthly': 98.0,  # 月度会员
    'yearly': 888.0  # 年度会员
}