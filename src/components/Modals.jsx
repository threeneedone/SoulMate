import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// 自定义模态框组件
const Modal = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border-4 border-rose-300 transform scale-105 animate-pop-in font-sans">
      <p className="text-xl font-bold text-gray-800 mb-6">{message}</p>
      <button
        onClick={onClose}
        className="mt-4 w-full py-3 bg-rose-500 text-white font-semibold rounded-xl shadow-lg hover:bg-rose-600 transition-all duration-300 transform hover:scale-105"
      >
        确定
      </button>
    </div>
  </div>
);

// 购买支付模态框
// 购买支付模态框
const PurchaseModal = ({ onPurchaseSuccess, onClose, API_BASE_URL }) => {
  // PropTypes验证
  PurchaseModal.propTypes = {
    onPurchaseSuccess: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    API_BASE_URL: PropTypes.string.isRequired
  };
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'success', 'failed', 'waiting_user'
  const [message, setMessage] = useState('正在创建订单...');
  const [orderId, setOrderId] = useState('');

  const handlePay = async () => {
    setIsProcessing(true);
    setPaymentStatus('pending');
    setMessage('正在创建订单...');

    try {
      // 1. 调用后端API创建支付订单
      console.log(`正在调用后端创建订单: ${API_BASE_URL}/payment/create`);
      const response = await fetch(`${API_BASE_URL}/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
  body: JSON.stringify({
          product_type: 'single',
    // 实际应用中应从用户登录状态获取openid
    // openid: 'test_openid',
          openid: 'test_openid'
        }),
      });
      if (!response.ok) throw new Error('创建支付订单失败');
      const data = await response.json();
      setOrderId(data.order_id);

      // 2. 调用微信支付JSAPI
      setMessage('请在微信中完成支付...');
      setPaymentStatus('waiting_user');

      // 检查微信环境
      if (typeof window.WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', () => onBridgeReady(data.jsapi_params), false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', () => onBridgeReady(data.jsapi_params));
          document.attachEvent('onWeixinJSBridgeReady', () => onBridgeReady(data.jsapi_params));
        }
      } else {
        onBridgeReady(data.jsapi_params);
      }
    } catch (error) {
      console.error('支付流程出错:', error);
      setPaymentStatus('failed');
      setMessage('支付失败，请稍后重试。');
      setIsProcessing(false);
    }
  };

  // 微信支付JSAPI回调
  const onBridgeReady = (params) => {
    window.WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      params,
      (res) => {
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          // 支付成功
          setPaymentStatus('success');
          setMessage('支付成功！');
          onPurchaseSuccess();
        } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
          // 支付取消
          setPaymentStatus('failed');
          setMessage('支付已取消');
        } else {
          // 支付失败
          setPaymentStatus('failed');
          setMessage('支付失败，请稍后重试。');
        }
        setIsProcessing(false);
      }
    );
  };

  useEffect(() => {
    handlePay();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border-4 border-amber-300 transform scale-105 animate-pop-in font-sans flex flex-col items-center justify-center min-h-[300px]">
        {paymentStatus === 'pending' && (
          <div className="text-center w-full">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="w-full h-full border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-xl font-bold text-gray-800">{message}</p>
            <p className="text-sm text-gray-500 mt-2 text-center">请稍候，天机正在接驳财神。</p>
          </div>
        )}
        {paymentStatus === 'waiting_user' && (
          <div className="text-center w-full">
            <svg className="mx-auto h-16 w-16 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <p className="text-xl font-bold text-gray-800">{message}</p>
            <p className="text-sm text-gray-500 mt-2 text-center">订单号: {orderId}</p>
            <p className="text-sm text-gray-500 mt-1 text-center">请在微信支付页面完成支付</p>
          </div>
        )}
        {paymentStatus === 'success' && (
          <div className="p-6 text-center w-full">
            <svg className="mx-auto h-16 w-16 text-green-500 mb-4 animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-green-600 mb-2">支付成功！</h3>
            <p className="text-sm text-gray-500">感谢您的支持，您已获得一次新的求缘机会。</p>
          </div>
        )}
        {paymentStatus === 'failed' && (
          <div className="p-6 text-center w-full">
            <svg className="mx-auto h-16 w-16 text-red-500 mb-4 animate-shake" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-red-600 mb-2">支付失败</h3>
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        )}

        <button
          onClick={onClose}
          disabled={isProcessing}
          className="mt-6 w-full max-w-[200px] py-3 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50 mx-auto"
        >
          {paymentStatus === 'success' ? '关闭' : '取消'}
        </button>
      </div>
    </div>
  );
};

// 分享验证模态框
const ShareModal = ({ onShareSuccess, onClose, canShareAgain }) => {
  // PropTypes验证
  ShareModal.propTypes = {
    onShareSuccess: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    canShareAgain: PropTypes.bool.isRequired
  };
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
      setIsUploadSuccess(false);
    }
  };

  const handleUploadAndVerify = async () => {
    if (!uploadedFile) {
        return;
    }

    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploadSuccess(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsVerifying(false);
    onShareSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border-4 border-rose-300 transform scale-105 animate-pop-in font-sans">
        <h3 className="text-2xl font-bold text-rose-500 mb-4">分享获取免费机会</h3>
        <p className="text-gray-700 mb-6">请将求缘结果分享到小红书，并上传截图进行验证。</p>
        
        {!canShareAgain ? (
            <div className="p-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-bold text-gray-800">您已在过去24小时内获得过分享机会</p>
              <p className="text-sm text-gray-500 mt-2">请稍后再试或通过购买获得机会。</p>
            </div>
        ) : isVerifying ? (
          <div className="p-6">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="w-full h-full border-4 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-xl font-bold text-gray-800">正在验证分享...</p>
            <p className="text-sm text-gray-500 mt-2 text-center">请稍候，天机正在审视您的诚心。</p>
          </div>
        ) : isUploadSuccess ? (
          <div className="p-6">
            <svg className="mx-auto h-16 w-16 text-green-500 mb-4 animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-green-600 mb-2">验证成功！</h3>
            <p className="text-sm text-gray-500">感谢您的分享，您已获得一次新的求缘机会。</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="share-file-input"
              />
              <label
                htmlFor="share-file-input"
                className="inline-block px-6 py-3 bg-rose-500 text-white font-semibold rounded-xl shadow-lg hover:bg-rose-600 transition-all duration-300 cursor-pointer"
              >
                选择分享截图
              </label>
            </div>
            {uploadedFile && (
              <div className="mb-4 p-2 border-2 border-dashed border-gray-300 rounded-xl">
                <p className="text-sm text-gray-600">已选择文件: {uploadedFile.name}</p>
              </div>
            )}
            <button
              onClick={handleUploadAndVerify}
              disabled={!uploadedFile}
              className="w-full py-3 bg-rose-500 text-white font-semibold rounded-xl shadow-lg hover:bg-rose-600 transition-all duration-300 disabled:opacity-50"
            >
              提交验证
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full max-w-[200px] py-3 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300 mx-auto"
        >
          取消
        </button>
      </div>
    </div>
  );
};

export { Modal, PurchaseModal, ShareModal };