from http import HTTPStatus
from urllib.parse import urlparse, unquote
from pathlib import PurePosixPath
import requests
from dashscope import ImageSynthesis
import os
import time
import logging
import dashscope

# 配置API密钥
# 优先从环境变量读取
api_key = os.environ.get('DASHSCOPE_API_KEY')
# 如果环境变量不存在，可以在这里设置
# api_key = 'your_api_key_here'

if api_key:
    dashscope.api_key = api_key
else:
    logging.warning('未设置DASHSCOPE_API_KEY，图像生成功能将无法使用')

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 图像生成配置
MODEL = "flux-schnell"
IMAGE_SIZE = "1024*1024"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "generated_images")

# 确保输出目录存在
os.makedirs(OUTPUT_DIR, exist_ok=True)

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
            # 调用图像生成API
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