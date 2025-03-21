#!/usr/bin/env python3
import os
import json

def read_game_configs(base_dir):
    games = []
    parent_dir = os.path.dirname(base_dir)
    for item in os.listdir(parent_dir):
        if item.startswith('_'):
            continue
        config_path = os.path.join(parent_dir, item, '.config')
        if os.path.isfile(config_path):
            with open(config_path, 'r') as f:
                game_config = json.load(f)
                # 添加相对路径，从Game目录到游戏目录
                game_config['entry'] = f'{item}/{game_config["entry"]}'
                games.append(game_config)
    return games

def generate_html(games):
    html_template = '''
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI上古怀旧游戏</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f2f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            color: #333;
        }
        .game-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px;
        }
        .game-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s;
            cursor: pointer;
        }
        .game-card:hover {
            transform: translateY(-5px);
        }
        .game-title {
            font-size: 1.5em;
            margin: 0 0 10px 0;
            color: #1a73e8;
        }
        .game-description {
            color: #666;
            margin: 0;
            line-height: 1.5;
        }
        #game-container {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            z-index: 1000;
        }
        #back-button {
            position: fixed;
            top: 20px;
            left: 20px;
            padding: 10px 20px;
            background: #1a73e8;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1001;
        }
        #back-button:hover {
            background: #1557b0;
        }
        #game-frame {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
    <script>
        function showGame(url) {
            document.getElementById('game-frame').src = url;
            document.getElementById('game-container').style.display = 'block';
        }
        
        function goBack() {
            document.getElementById('game-frame').src = '';
            document.getElementById('game-container').style.display = 'none';
        }
    </script>
</head>
<body>
    <div class="container">
        <h1>AI上古怀旧游戏</h1>
        <div class="game-grid">
'''

    for game in games:
        html_template += f'''
            <div class="game-card" onclick="showGame('{game['entry']}')">
                <h2 class="game-title">{game['name']}</h2>
                <p class="game-description">{game['description']}</p>
            </div>
'''

    html_template += '''
        </div>
    </div>
    <div id="game-container">
        <button id="back-button" onclick="goBack()">返回</button>
        <iframe id="game-frame"></iframe>
    </div>
</body>
</html>
'''

    return html_template

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    games = read_game_configs(script_dir)
    html_content = generate_html(games)
    
    # 将index.html生成到Game目录下
    parent_dir = os.path.dirname(script_dir)
    with open(os.path.join(parent_dir, 'index.html'), 'w') as f:
        f.write(html_content)
    
    print("Portal page has been generated successfully!")

if __name__ == '__main__':
    main()