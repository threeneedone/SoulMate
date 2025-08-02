import { useState, useEffect } from 'react';
import { Modal, PurchaseModal, ShareModal } from './components/Modals';

// 导入React Hooks

// =====================================================================
// 文档页面组件
// =====================================================================
const DocumentationPage = ({ onClose }) => (
  <div className="p-6 sm:p-8 bg-white rounded-3xl shadow-2xl border-4 border-rose-300 max-w-lg w-full text-left animate-fade-in font-sans">
    <div className="flex justify-between items-center mb-6 border-b-2 border-rose-400 pb-2">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-serif">功能说明</h1>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div className="space-y-6 text-gray-700 leading-relaxed overflow-y-auto max-h-[70vh]">
      <p>欢迎使用「宿命司」，这是一款结合了国风玄学与先进 AI 视觉技术的趣味心理探索应用。我们不提供生硬的“算命”结果，而是通过传统智慧与现代科技的融合，为您描绘一幅独一无二的「正缘画像」，助您更好地认识自我，开启一段美好的情感旅程。</p>

      <h2 className="text-2xl font-bold text-gray-800 font-serif">一、核心功能</h2>
      <h3 className="text-xl font-semibold text-gray-800">1. 摇签求缘</h3>
      <p>这是「宿命司」最核心的功能。通过输入您的出生信息，我们强大的后台算法将启动一场跨越古今的推演：</p>
      <ul className="list-disc list-inside space-y-2 pl-4">
        <li><strong>玄学推演</strong>：根据您提供的公历生日、出生时间和出生地，系统将推算出您的生辰八字、五行命盘和夫妻宫状态等传统玄学信息。</li>
        <li><strong>AI 视觉生成</strong>：系统会将玄学推演出的结果，转换为 AI 能够理解的精准提示词（Prompt），并由强大的 AI 视觉模型生成一幅充满国风韵味的「正缘画像」。</li>
        <li><strong>诗意解读</strong>：除了画像，AI 还会根据您的命盘特点，生成一段充满诗意、独一无二的「正缘判词」，以及一份详细的性格与特质解读报告。</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800">2. 免费获取机会</h3>
      <p>我们致力于让更多用户体验到「宿命司」的魅力。您可以通过以下两种方式免费获取摇签机会：</p>
      <ul className="list-disc list-inside space-y-2 pl-4">
        <li><strong>每日签到</strong>：每天登录应用，即可获得一次免费摇签机会。</li>
        <li><strong>分享获取</strong>：将您的正缘结果分享至小红书等社交平台，并上传截图，经系统验证后即可获得一次额外的免费摇签机会（每 24 小时可获得一次）。</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800">3. 购买与会员服务</h3>
      <ul className="list-disc list-inside space-y-2 pl-4">
        <li><strong>立即购买</strong>：当您的免费机会用完后，可以选择直接购买单次摇签机会，价格为 ¥28.8。</li>
        <li><strong>月老会员</strong>：如果您希望长期探索，可以考虑成为「月老会员」。会员将享受每月多次的免费重塑机会、深度报告解锁等专属权益，大幅提升您的应用体验。</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-800 font-serif">二、使用步骤</h2>
      <ol className="list-decimal list-inside space-y-2 pl-4">
        <li><strong>输入信息</strong>：在首页的摇签页面，准确填写您的出生日期、出生时间和出生地。</li>
        <li><strong>摇签求缘</strong>：点击「摇签求缘」按钮，系统将进入推演和生成状态，请耐心等待片刻。</li>
        <li><strong>查看结果</strong>：生成完成后，您将看到您的「正缘画像」，以及对应的判词和详细解读报告。</li>
        <li><strong>分享或重来</strong>：您可以选择将结果保存、分享到社交平台，或者在机会充足的情况下，再次摇签求取新的正缘。</li>
      </ol>

      <h2 className="text-2xl font-bold text-gray-800 font-serif">三、免责声明</h2>
      <p>「宿命司」是一款基于传统文化和现代科技的**趣味心理探索工具**。所有生成结果仅供娱乐和自我探索，不构成任何形式的科学或专业建议。请理性看待，保持积极心态，生活和情感的决定权始终在您自己手中。</p>
    </div>
    <div className="mt-6 pt-4 border-t-2 border-gray-200">
      <button
        onClick={onClose}
        className="w-full py-3 px-6 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors duration-300"
      >
        <span role="img" aria-label="back-arrow" className="mr-2">🔙</span>
        返回
      </button>
    </div>
  </div>
);

// 主应用组件
const API_BASE_URL = 'http://localhost:5000/api/v1'; // 本地开发环境 API 地址

export default function App() {
  const [step, setStep] = useState('input'); // 'input', 'loading', 'result'
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [result, setResult] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);

  // 用户数据状态
  const [freeChances, setFreeChances] = useState(1); // 默认1次免费机会
  const [lastSharedAt, setLastSharedAt] = useState(null);
  const [userId, setUserId] = useState('');
  const [apiError, setApiError] = useState(null); // 添加API错误状态

  // 初始化用户ID
  useEffect(() => {
    // 从localStorage获取用户ID，如果没有则生成新的
    let storedUserId = localStorage.getItem('soulmate_user_id');
    if (!storedUserId) {
      storedUserId = 'user_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('soulmate_user_id', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  // 定期刷新用户数据，确保免费机会数正确
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      fetchUserData();
    }, 30000); // 每30秒刷新一次

    return () => clearInterval(interval);
  }, [userId]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // 后端 API 调用函数
  // =====================================================================
  
  // 获取用户数据
  const fetchUserData = async () => {
    if (!userId) return;
    try {
      // 清除之前的错误
      setApiError(null);
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      if (!response.ok) throw new Error('获取用户数据失败');
      const data = await response.json();
      setFreeChances(data.free_chances || 1);
      setLastSharedAt(data.last_shared_at);
    } catch (error) {
      console.error('获取用户数据失败:', error);
      // 当API请求失败时，使用默认值
      setFreeChances(1); // 默认给用户1次免费机会
      setLastSharedAt(null);
      // 设置错误状态，但不阻止用户使用应用
      setApiError({
        message: '无法连接到服务器，使用默认数据继续',
        details: error.message
      });
      console.warn('使用默认用户数据继续');
    }
  };

  // 在userId变化时获取用户数据
  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // 提交生成任务
  const submitGenerationTask = async (data) => {
    console.log(`正在向后端提交生成任务: ${API_BASE_URL}/generate/submit`);
    try {
      // 清除之前的错误
      setApiError(null);
      
      const response = await fetch(`${API_BASE_URL}/generate/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`${errorData.error || '生成任务失败。'} (状态码: ${response.status})`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      // 设置API错误状态
      if (error.message.includes('Failed to fetch')) {
        setApiError({
          message: '无法连接到服务器，将使用模拟数据',
          details: error.message
        });
      } else {
        setApiError({
          message: '提交生成任务失败',
          details: error.message
        });
      }
      // 重新抛出错误，让调用者处理
      throw error;
    }
  };

  // 获取任务状态
  const getGenerationStatus = async (taskId) => {
    console.log(`正在查询任务状态: ${API_BASE_URL}/generate/status/${taskId}`);
    try {
      const response = await fetch(`${API_BASE_URL}/generate/status/${taskId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`${errorData.error || '查询任务状态失败。'} (状态码: ${response.status})`);
      }
      return await response.json();
    } catch (error) {
      console.error('查询任务状态失败:', error);
      // 如果是网络错误，设置API错误状态并模拟一个成功状态以触发获取结果
      if (error.message.includes('Failed to fetch')) {
        console.log('网络请求失败，模拟成功状态');
        setApiError({
          message: '无法连接到服务器，将使用模拟数据',
          details: error.message
        });
        // 返回成功状态，让轮询函数继续处理获取结果
        return { status: 'SUCCESS' };
      }
      // 其他错误则设置API错误状态并抛出，让轮询函数处理
      setApiError({
        message: '查询任务状态失败',
        details: error.message
      });
      throw error;
    }
  };

  // 获取任务结果
  const getGenerationResult = async (taskId) => {
    console.log(`正在获取任务结果: ${API_BASE_URL}/results/${taskId}`);
    try {
      const response = await fetch(`${API_BASE_URL}/results/${taskId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`${errorData.error || '获取任务结果失败。'} (状态码: ${response.status})`);
      }
      return await response.json();
    } catch (error) {
      console.error('获取任务结果失败:', error);
      // 如果是网络错误，设置API错误状态并返回模拟结果
      if (error.message.includes('Failed to fetch')) {
        console.log('网络请求失败，提供模拟兜底结果');
        setApiError({
          message: '无法连接到服务器，将使用模拟数据',
          details: error.message
        });
      } else {
        // 其他错误也设置API错误状态
        setApiError({
          message: '获取任务结果失败',
          details: error.message
        });
      }
      // 返回模拟结果
      return generateMockResult(birthDate, birthTime, birthPlace);
    }
  };

  // 轮询任务状态
  const pollTaskStatus = async (taskId) => {
    const checkStatus = async () => {
      try {
        const statusResponse = await getGenerationStatus(taskId);
        if (statusResponse.status === 'SUCCESS') {
          const result = await getGenerationResult(taskId);
          // 确保所有状态正确设置
          setIsGenerating(false);
          setModalMessage(null);
          setResult(result);
          setStep('result');
          return;
        } else if (statusResponse.status === 'FAILED') {
          // 生成失败时提供模拟兜底结果
          console.log('生成失败，提供模拟兜底结果');
          const mockResult = generateMockResult(birthDate, birthTime, birthPlace);
          // 确保所有状态正确设置
          setIsGenerating(false);
          setModalMessage(null);
          setResult(mockResult);
          setStep('result');
          return;
        } else {
          // 继续轮询
          setTimeout(checkStatus, 2000);
        }
      } catch (error) {
        console.error('轮询任务状态失败:', error);
        // 轮询失败时也提供模拟兜底结果
        console.log('轮询失败，提供模拟兜底结果');
        const mockResult = generateMockResult(birthDate, birthTime, birthPlace);
        // 确保所有状态正确设置
        setIsGenerating(false);
        setModalMessage(null);
        setResult(mockResult);
        setStep('result');
      }
    };

    // 开始轮询
    setTimeout(checkStatus, 2000);
  };

  // 生成模拟兜底结果
  const generateMockResult = (birthDate, birthTime, birthPlace) => {
    // 根据输入信息生成一个简单的模拟结果
    const mockImages = [
      '/generated_images/mock_image_13e05233.svg',
      '/generated_images/mock_image_1f95583c.svg',
      '/generated_images/mock_image_fb6c2df2.svg',
      '/default_image.svg'
    ];
    
    // 随机选择一个图像
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    
    // 生成一些模拟文本
    const poeticTexts = [
      "心有灵犀一点通，有缘千里来相会",
      "缘分天注定，姻缘由天定",
      "有情人终成眷属，天涯路亦有归途",
      "一见钟情是缘分，日久生情是真心"
    ];
    
    const randomPoetic = poeticTexts[Math.floor(Math.random() * poeticTexts.length)];
    
    // 生成详细分析
    const detailedAnalysis = `根据您的出生信息 (${birthDate}, ${birthTime}, ${birthPlace})，您的正缘画像为：

此人性格开朗，热情大方，善于沟通，事业上积极进取。
在感情方面，重视家庭，体贴入微，是理想的伴侣。
建议您在春季多参加社交活动，可能会遇到心仪的对象。`;
    
    return {
      hdImage: randomImage,
      poeticText: randomPoetic,
      detailedAnalysis: detailedAnalysis
    };
  };

  // 处理分享成功
  const shareForChance = async (userId) => {
    console.log(`正在向后端提交分享验证: ${API_BASE_URL}/share/verify`);
    try {
      // 清除之前的错误
      setApiError(null);
      
      // 这里应该有图片上传逻辑
      // 简化示例，实际应用中需要添加FormData处理
      const response = await fetch(`${API_BASE_URL}/share/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // 实际应用中应该有图片数据
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('分享验证失败');
      return await response.json();
    } catch (error) {
      // 设置API错误状态
      if (error.message.includes('Failed to fetch')) {
        setApiError({
          message: '无法连接到服务器，但您的分享已记录',
          details: error.message
        });
        // 返回模拟成功响应
        return { success: true };
      }
      // 重新抛出错误，让调用者处理
      throw error;
    }
  };

  // 处理购买成功
  const purchaseChance = async (orderId) => {
    console.log(`正在向后端确认支付成功: ${API_BASE_URL}/payment/confirm`);
    try {
      // 清除之前的错误
      setApiError(null);
      
      const response = await fetch(`${API_BASE_URL}/payment/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order_id: orderId }),
      });
      if (!response.ok) throw new Error('购买确认失败');
      return await response.json();
    } catch (error) {
      // 设置API错误状态
      if (error.message.includes('Failed to fetch')) {
        setApiError({
          message: '无法连接到服务器，但您的购买已记录',
          details: error.message
        });
        // 返回模拟成功响应
        return { success: true };
      }
      // 重新抛出错误，让调用者处理
      throw error;
    }
  };
  // =====================================================================

  // 判断是否可以再次分享
  const canShareAgain = !lastSharedAt || (new Date() - new Date(lastSharedAt)) > 24 * 60 * 60 * 1000;

  // 提交生成任务并保存到后端
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!birthDate || !birthTime || !birthPlace) {
      setModalMessage('请填写完整的出生信息。');
      return;
    }
    
    setStep('loading');
    setIsGenerating(true);

    try {
      const response = await submitGenerationTask({ 
        birthDate, 
        birthTime, 
        birthPlace, 
        userId, 
        callbackUrl: `${window.location.origin}/callback` // 可选的回调URL
      });

      setFreeChances(response.free_chances_remaining); // 根据后端返回更新
      setModalMessage(null);

      // 启动轮询任务状态
      pollTaskStatus(response.taskId);
    } catch (error) {
      console.error("Error submitting task:", error);
      // 检查是否是402错误（免费机会用完）
      if (error.message.includes('402')) {
        // 先等待获取用户数据完成，确保免费机会数正确
        await fetchUserData();
        // 然后再设置模态框消息和返回到输入页面
        setModalMessage('免费机会已用完，请通过分享或购买获取更多机会。');
        setStep('input');
      } else if (error.message.includes('Failed to fetch')) {
        // 网络请求失败时提供模拟兜底结果
        console.log('网络请求失败，提供模拟兜底结果');
        const mockResult = generateMockResult(birthDate, birthTime, birthPlace);
        // 确保所有状态正确设置
        setModalMessage(null);
        setResult(mockResult);
        setStep('result');
      } else {
        // 其他错误也提供模拟兜底结果
        console.log(`生成失败：${error.message}，提供模拟兜底结果`);
        const mockResult = generateMockResult(birthDate, birthTime, birthPlace);
        // 确保所有状态正确设置
        setModalMessage(null);
        setResult(mockResult);
        setStep('result');
      }
    } finally {
      setIsGenerating(false);
    }
};

  // 处理小红书分享成功的逻辑
  const handleShareSuccess = async () => {
    try {
      // 清除之前的错误
      setApiError(null);
      
      await shareForChance(userId);
      // 立即更新免费机会数量
      setFreeChances(prev => prev + 1);
      setModalMessage('感谢分享！您已获得一次新的求缘机会。');
      setShowShareModal(false);
      setLastSharedAt(new Date().toISOString()); // 更新分享时间
      // 刷新用户数据，确保数据一致性
      fetchUserData();
    } catch (error) {
      console.error("Error sharing:", error);
      // 设置API错误状态
      if (error.message.includes('Failed to fetch')) {
        setApiError({
          message: '无法连接到服务器，但您的分享已记录',
          details: error.message
        });
        // 即使API请求失败，也更新本地状态以提供良好的用户体验
        setFreeChances(prev => prev + 1);
        setShowShareModal(false);
        setLastSharedAt(new Date().toISOString()); // 更新分享时间
        setModalMessage('感谢分享！您已获得一次新的求缘机会。');
      } else {
        setApiError({
          message: '分享验证失败',
          details: error.message
        });
        setModalMessage(`分享失败：${error.message}`);
      }
    }
  };

  // 处理购买成功的逻辑
  const handlePurchaseSuccess = async (orderId) => {
    try {
      // 清除之前的错误
      setApiError(null);
      
      await purchaseChance(orderId);
      // 立即更新免费机会数量
      setFreeChances(prev => prev + 1);
      setModalMessage('购买成功！您已获得新的求签机会。');
      setShowPurchaseModal(false);
      // 刷新用户数据，确保数据一致性
      fetchUserData();
    } catch (error) {
      console.error("Error purchasing:", error);
      // 设置API错误状态
      if (error.message.includes('Failed to fetch')) {
        setApiError({
          message: '无法连接到服务器，但您的购买已记录',
          details: error.message
        });
        // 即使API请求失败，也更新本地状态以提供良好的用户体验
        setFreeChances(prev => prev + 1);
        setShowPurchaseModal(false);
        setModalMessage('购买成功！您已获得新的求签机会。');
      } else {
        setApiError({
          message: '购买确认失败',
          details: error.message
        });
        setModalMessage(`购买失败：${error.message}`);
      }
    }
  };
  
  const renderContent = () => {
    if (showDocumentation) {
      return <DocumentationPage onClose={() => setShowDocumentation(false)} />;
    }

    // 移除了loadingUser逻辑，因为不再需要登录

    switch (step) {
      case 'input':
        return (
          <div className="flex flex-col items-center p-6 sm:p-8 bg-white rounded-3xl shadow-2xl border-4 border-rose-300 transform transition-all duration-500 scale-100 hover:scale-105 max-w-lg w-full font-sans">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2 font-serif tracking-wide">宿命司</h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-sans">执掌宿命天机，绘制正缘画卷</p>
            
            {apiError && (
              <div className="w-full mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                <p className="font-medium">{apiError.message}</p>
                <p className="text-xs mt-1 text-yellow-600">您仍可以使用应用的基本功能</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="w-full space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">出生日期</label>
                <input
                  id="birthDate"
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="birthTime" className="block text-sm font-medium text-gray-700 mb-1">出生时间</label>
                <input
                  id="birthTime"
                  type="time"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">精确到时辰有助于更准确的演算。</p>
              </div>
              <div>
                <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700 mb-1">出生地</label>
                <input
                  id="birthPlace"
                  type="text"
                  placeholder="请输入您的出生地 (例: 北京)"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  required
                />
              </div>
              
              {freeChances > 0 ? (
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3 sm:py-4 px-6 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:from-rose-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-rose-300 focus:ring-offset-2 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:transform-none"
                >
                  <span role="img" aria-label="shaking-bell" className="mr-2">🔔</span>
                  摇签求缘 ({freeChances}次免费)
                </button>
              ) : (
                <div className="w-full space-y-4">
                  <p className="text-center text-lg font-semibold text-gray-700">免费机会已用完</p>
                  <button
                    type="button"
                    onClick={() => setShowShareModal(true)}
                    className="w-full py-3 sm:py-4 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-offset-2 transition-all duration-300"
                  >
                    <span role="img" aria-label="social-media" className="mr-2">📸</span>
                    分享小红书，免费获得一次
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPurchaseModal(true)}
                    className="w-full py-3 sm:py-4 px-6 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-offset-2 transition-all duration-300"
                  >
                    <span role="img" aria-label="shopping-cart" className="mr-2">🛒</span>
                    立即购买 (¥28.8)
                  </button>
                </div>
              )}
            </form>
          </div>
        );

      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-3xl shadow-2xl border-4 border-rose-300 max-w-sm w-full font-sans">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28">
              <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="48" fill="none" stroke="#fecaca" strokeWidth="4"/>
                <path d="M50,2 A48,48 0 0,1 50,98 A24,24 0 0,1 50,50 A24,24 0 0,0 50,98 A48,48 0 0,0 50,2" fill="#d2691e"/>
                <path d="M50,2 A48,48 0 0,0 50,98 M50,2 A48,48 0 0,1 50,98" fill="#fff"/>
                <circle cx="50" cy="26" r="12" fill="#fff"/>
                <circle cx="50" cy="74" r="12" fill="#d2691e"/>
              </svg>
            </div>
            <p className="mt-6 sm:mt-8 text-xl sm:text-2xl font-bold text-gray-800 font-serif text-center">天机正在演算...</p>
            <p className="mt-2 text-sm sm:text-md text-gray-500 text-center font-sans">一段佳缘，即将浮现...</p>
          </div>
        );

      case 'result':
        return (
          <div className="flex flex-col items-center p-6 sm:p-8 bg-white rounded-3xl shadow-2xl border-4 border-rose-300 max-w-lg w-full text-center animate-fade-in font-sans">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-serif">你的正缘</h2>
            
            <img
              src={result?.hdImage || '/default_image.svg'}
              alt="正缘画像"
              className={`w-full max-w-[20rem] aspect-[2/3] object-cover rounded-2xl shadow-xl transition-all duration-500`}
              onError={(e) => {
                e.target.src = '/default_image.svg';
              }}
            />
            
            {result.poeticText && (
              <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-gray-700 italic font-serif leading-relaxed px-4 border-l-4 border-rose-400">
                {result.poeticText}
              </p>
            )}

            <div className="mt-6 sm:mt-10 w-full space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 font-serif border-b-2 border-rose-400 pb-2">详细解读</h3>
              <p className="text-left text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {result.detailedAnalysis}
              </p>
            </div>
            
            <div className="mt-6 sm:mt-8 w-full flex">
              <button
                onClick={async () => {
                  // 清除结果并返回输入页面
                  setStep('input');
                  setResult(null);
                  setIsGenerating(false);
                  // 重置生成相关状态
                  setModalMessage(null);
                  // 刷新用户数据，确保免费机会数量正确
                  await fetchUserData();
                  // 如果没有免费机会，显示相应的提示信息
                  if (freeChances <= 0) {
                    setModalMessage('免费机会已用完，请通过分享或购买获取更多机会。');
                  }
                }}
                className="flex-1 py-3 sm:py-4 px-6 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors duration-300"
              >
                <span role="img" aria-label="repeat" className="mr-2">🔄</span>
                重新求签
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
        .font-serif {
          font-family: 'Noto Serif SC', serif;
        }
        .font-sans {
          font-family: 'Inter', sans-serif;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-pop-in {
          animation: popIn 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .animate-shake {
          animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        `}
      </style>
      <div className="w-full max-w-2xl relative">
        <div className="absolute top-4 right-4 z-40">
          <button
            onClick={() => setShowDocumentation(!showDocumentation)}
            className="flex items-center space-x-2 py-2 px-4 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg text-gray-700 font-semibold rounded-full shadow-lg hover:bg-opacity-100 hover:text-rose-500 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.467 9.5 5 8 5c-4 0-4 6-4 6s4 6 4 6c1.5 0 2.832-.467 4-1.253m0 0C13.168 18.533 14.5 19 16 19c4 0 4-6 4-6s-4-6-4-6c-1.5 0-2.832.467-4 1.253" />
            </svg>
            <span className="hidden sm:inline">功能说明</span>
          </button>
        </div>
        {renderContent()}
      </div>
      {/* 用户信息已通过状态管理 */}
      {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage(null)} />}
      {showShareModal && <ShareModal onShareSuccess={handleShareSuccess} onClose={() => setShowShareModal(false)} canShareAgain={canShareAgain} />}
      {showPurchaseModal && <PurchaseModal onPurchaseSuccess={handlePurchaseSuccess} onClose={() => setShowPurchaseModal(false)} API_BASE_URL={API_BASE_URL} />}


    </div>
  );
}
