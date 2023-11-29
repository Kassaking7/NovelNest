import requests
from markdownify import markdownify as md
from bs4 import BeautifulSoup
def save_to_markdown(content, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(content)

def get_novel_content(url,start,end):
    # 发送HTTP请求获取网页内容
    id = 0
    for i in range(start,end):
        nurl = url + str(i) + ".htm"
        print(nurl)
        response = requests.get(nurl)
        # 判断请求是否成功
        if response.status_code != 200:
            print("请求失败")
            return
        
        # 使用BeautifulSoup解析网页内容
        soup = BeautifulSoup(response.content, 'html.parser')
    
        # 找到小说内容的部分（根据实际网页结构调整）
        novel_content = soup.find('div', class_='text')  # 可能需要根据实际网页结构调整选择器
        novel_title = soup.find('div', class_='title')  # 可能需要根据实际网页结构调整选择器
        title = novel_title.get_text().split(' ', 1)[1]
        if not novel_content:
            return '内容未找到'
        # 将 <br> 标签转换为换行符
        for br in novel_content.find_all('br'):
            br.replace_with('\n\n')
        # 返回处理后的小说内容文本
        content = novel_content.get_text()
        zid = '%04d' % id
        id += 1
        if content:
            out = f'''---
aid: "0000"
zid: "{zid}"
title: {title}
author: 骷髅精灵
---

{md(content)}
'''
            save_to_markdown(out, f'{zid}.md')
        else:
            continue


    


url = 'http://m.ymoxuan.net/wu22546/'
start =  21433003
end = 21433010
# 获取小说内容
content = get_novel_content(url,start,end)
print(content)
# 如果内容获取成功，则保存到Markdown文件
