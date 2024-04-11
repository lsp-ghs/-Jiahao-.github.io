import json

# 准备数据
data = [
    {"question": "What is the capital of France?", "answer": "Paris"},
    {"question": "Who wrote '1984'?", "answer": "George Orwell"},
    {"question": "What is the smallest planet in our solar system?", "answer": "Mercury"}
]

# 指定数据集文件路径
dataset_path = 'D:/project/js/dataset.jsonl'  # 注意文件扩展名已更改为 .jsonl

# 将数据以 JSONL 格式写入文件
with open(dataset_path, 'w', encoding='utf-8') as f:
    for item in data:
        json_str = json.dumps(item, ensure_ascii=False)
        f.write(json_str + '\n')  # 在每个 JSON 字符串后添加换行符
