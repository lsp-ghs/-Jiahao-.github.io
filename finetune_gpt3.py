import os
import openai

# 从环境变量获取 OpenAI API 密钥
openai.api_key = os.getenv("OPENAI_API_KEY")

# 创建微调作业
try:
    response = openai.FineTune.create(
        training_file="file-QHaUNWlBLwm8AIzsx2pwy2aQ",  # 使用您上传的文件 ID
        model="gpt-3.5-turbo"  # 指定基于哪个预训练模型进行微调
        # 如果需要，您可以在这里添加其他参数，比如 `n_epochs`、`batch_size` 等
    )
    print(response)
except openai.error.OpenAIError as e:
    print(e)
