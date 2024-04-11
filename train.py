import json
import nltk
import random
from nltk.corpus import wordnet

# 确保已下载NLTK数据集
nltk.download('wordnet')
nltk.download('omw-1.4')

def get_synonyms(word):
    """获取词的同义词列表"""
    synonyms = set()
    for syn in wordnet.synsets(word):
        for lemma in syn.lemmas():
            synonym = lemma.name().replace("_", " ").replace("-", " ").lower()
            synonym = "".join([char for char in synonym if char.isalpha() or char == " "])
            synonyms.add(synonym)
    if word in synonyms:
        synonyms.remove(word)
    return list(synonyms)

def synonym_replacement(sentence, n):
    """同义词替换：在句子中随机选择n个词替换为其同义词"""
    words = sentence.split()
    new_words = words.copy()
    random_word_list = list(set([word for word in words if word not in ['I', 'you', 'he', 'she', 'it', 'we', 'they']]))
    random.shuffle(random_word_list)
    num_replaced = 0
    for random_word in random_word_list:
        synonyms = get_synonyms(random_word)
        if len(synonyms) >= 1:
            synonym = random.choice(synonyms)
            new_words = [synonym if word == random_word else word for word in new_words]
            num_replaced += 1
        if num_replaced >= n:
            break

    sentence = ' '.join(new_words)
    return sentence

def random_insertion(sentence, n):
    """随机插入：在句子中随机插入n个词的同义词"""
    words = sentence.split()
    new_words = words.copy()
    for _ in range(n):
        add_word = random.choice(words)
        synonyms = get_synonyms(add_word)
        if synonyms:
            synonym = random.choice(synonyms)
            insert_pos = random.randint(0, len(new_words))
            new_words.insert(insert_pos, synonym)

    sentence = ' '.join(new_words)
    return sentence

def augment_data(file_path, output_path):
    with open(file_path, 'r', encoding='utf-8') as f_in, open(output_path, 'w', encoding='utf-8') as f_out:
        for line in f_in:
            data = json.loads(line.strip())
            for dialogue in data['conversation']:
                original_text = dialogue['content']
                # 应用同义词替换方法
                augmented_text_syn = synonym_replacement(original_text, 2)
                # 更新对话内容
                dialogue['content'] = augmented_text_syn
                # 应用随机插入方法
                augmented_text_ins = random_insertion(augmented_text_syn, 2)
                # 再次更新对话内容
                dialogue['content'] = augmented_text_ins
            # 写入新的JSONL文件
            f_out.write(json.dumps(data) + '\n')

# 指定原始文件和输出文件的路径
file_path = "D:/project/js/data.jsonl"
output_path = "D:/project/js/augmented_data.jsonl"

# 调用增强函数
augment_data(file_path, output_path)

print(f"增强后的数据已写入 {output_path}")
