from http import HTTPStatus
from urllib.parse import urlparse, unquote
from pathlib import PurePosixPath
import requests
from dashscope import ImageSynthesis
import os
import time
import logging
import random
import uuid
import dashscope

# 配置API密钥
# 优先从环境变量读取
api_key = os.environ.get('DASHSCOPE_API_KEY')
# 模拟模式开关 - 当没有API密钥时自动启用
use_mock = os.environ.get('USE_MOCK', str(not api_key)).lower() == 'true'

if api_key and not use_mock:
    dashscope.api_key = api_key
elif use_mock:
    logging.info('启用模拟模式，将生成模拟图像')
else:
    logging.warning('未设置DASHSCOPE_API_KEY，图像生成功能将无法使用')

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 图像生成配置
MODEL = "flux-schnell"
IMAGE_SIZE = "1024*1024"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "generated_images")

# 模拟数据 - 预定义一些图像路径
MOCK_IMAGES = [
    "default_image.svg",
    # 可以添加更多预定义的图像路径
]

# 确保输出目录存在
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 如果启用模拟模式，确保至少有一个默认图像
if use_mock and not os.path.exists(os.path.join(OUTPUT_DIR, "default_image.svg")):
    # 复制public目录下的default_image.svg到generated_images目录
    public_default = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "default_image.svg")
    if os.path.exists(public_default):
        import shutil
        shutil.copy(public_default, os.path.join(OUTPUT_DIR, "default_image.svg"))
    else:
        # 如果public目录下也没有，则创建一个简单的SVG
        svg_content = '''<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#f8f8f8"/>
  <text x="512" y="512" font-family="Arial" font-size="48" text-anchor="middle" fill="#333">模拟图像</text>
</svg>'''
        with open(os.path.join(OUTPUT_DIR, "default_image.svg"), "w") as f:
            f.write(svg_content)

class ImageGenerator:
    @staticmethod
    def generate_image(prompt):
        """
        生成图像并保存到本地
        :param prompt: 图像生成提示词
        :return: 生成的图像路径，如果失败则返回None
        """
        try:
            logger.info(f"开始生成图像，提示词: {prompt}")

            if use_mock:
                # 模拟模式
                logger.info("使用模拟模式生成图像")
                # 模拟生成延迟
                time.sleep(1)
                # 随机选择一个模拟图像或生成新的模拟图像
                if random.random() < 0.7 and MOCK_IMAGES:
                    # 70%概率返回已有模拟图像
                    file_name = random.choice(MOCK_IMAGES)
                else:
                    # 30%概率生成新的模拟图像文件名
                    file_name = f"mock_image_{uuid.uuid4().hex[:8]}.svg"
                    # 创建一个简单的SVG文件
                    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#f0f0f0"/>
  <text x="512" y="512" font-family="Arial" font-size="36" text-anchor="middle" fill="#333">模拟生成图像</text>
  <text x="512" y="560" font-family="Arial" font-size="24" text-anchor="middle" fill="#666">提示词: {prompt[:30]}{'...' if len(prompt) > 30 else ''}</text>
</svg>'''
                    with open(os.path.join(OUTPUT_DIR, file_name), "w") as f:
                        f.write(svg_content)
                    # 添加到模拟图像列表
                    MOCK_IMAGES.append(file_name)
                logger.info(f"模拟图像生成成功: {file_name}")
                return file_name
            else:
                # 真实API调用
                from dashscope import ImageSynthesis
                import dashscope
                rsp = ImageSynthesis.call(
                    model=MODEL,
                    prompt=prompt,
                    size=IMAGE_SIZE
                )

                if rsp.status_code == HTTPStatus.OK:
                    logger.info(f"图像生成成功: {rsp.output}")
                    logger.info(f"使用资源: {rsp.usage}")

                    # 保存图像到本地
                    for result in rsp.output.results:
                        file_name = PurePosixPath(unquote(urlparse(result.url).path)).parts[-1]
                        file_path = os.path.join(OUTPUT_DIR, file_name)
                        with open(file_path, 'wb+') as f:
                            f.write(requests.get(result.url).content)
                        logger.info(f"图像已保存到: {file_path}")
                        return file_name  # 返回文件名，供前端使用
                else:
                    logger.error(f"图像生成失败, status_code: {rsp.status_code}, code: {rsp.code}, message: {rsp.message}")
                    return "default_image.svg"
        except Exception as e:
            logger.error(f"图像生成过程中发生错误: {str(e)}")
            return "default_image.svg"

    @staticmethod
    def generate_async_image(prompt):
        """
        异步生成图像
        :param prompt: 图像生成提示词
        :return: 任务ID
        """
        try:
            rsp = ImageSynthesis.async_call(
                model=MODEL,
                prompt=prompt,
                size=IMAGE_SIZE
            )

            if rsp.status_code == HTTPStatus.OK:
                logger.info(f"异步图像生成任务已提交: {rsp.output}")
                return rsp.output.task_id
            else:
                logger.error(f"异步图像生成任务提交失败: {rsp.status_code}, {rsp.code}, {rsp.message}")
                return "default_image.svg"
        except Exception as e:
            logger.error(f"异步图像生成任务提交过程中发生错误: {str(e)}")
            return "default_image.svg"

    @staticmethod
    def fetch_image(task_id):
        """
        获取异步生成的图像
        :param task_id: 任务ID
        :return: 图像路径，如果失败则返回None
        """
        try:
            status = ImageSynthesis.fetch(task_id)
            if status.status_code == HTTPStatus.OK:
                if status.output.task_status == "SUCCEEDED":
                    for result in status.output.results:
                        file_name = PurePosixPath(unquote(urlparse(result.url).path)).parts[-1]
                        file_path = os.path.join(OUTPUT_DIR, file_name)
                        with open(file_path, 'wb+') as f:
                            f.write(requests.get(result.url).content)
                        return file_name
                else:
                    logger.info(f"图像生成任务尚未完成: {status.output.task_status}")
                    return None
            else:
                logger.error(f"获取图像生成任务状态失败: {status.status_code}, {status.code}, {status.message}")
                return "default_image.svg"
        except Exception as e:
            logger.error(f"获取图像生成任务状态过程中发生错误: {str(e)}")
            return "default_image.svg"

# 测试代码
if __name__ == '__main__':
    test_prompt = "Eagle flying freely in the blue sky and white clouds"
    ImageGenerator.generate_image(test_prompt)