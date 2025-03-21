// 100个最基础的小学英语单词及其中文翻译
const wordBank = [
    // 基础名词 (日常用品、动物、食物)
    {en: 'book', cn: '书'}, {en: 'pen', cn: '笔'}, {en: 'bag', cn: '包'},
    {en: 'cat', cn: '猫'}, {en: 'dog', cn: '狗'}, {en: 'bird', cn: '鸟'},
    {en: 'fish', cn: '鱼'}, {en: 'apple', cn: '苹果'}, {en: 'milk', cn: '牛奶'},
    {en: 'water', cn: '水'}, {en: 'rice', cn: '米饭'}, {en: 'bread', cn: '面包'},
    {en: 'egg', cn: '鸡蛋'}, {en: 'chair', cn: '椅子'}, {en: 'desk', cn: '桌子'},
    
    // 家庭成员
    {en: 'mom', cn: '妈妈'}, {en: 'dad', cn: '爸爸'}, {en: 'sister', cn: '姐妹'},
    {en: 'brother', cn: '兄弟'}, {en: 'baby', cn: '婴儿'},
    
    // 基础动词
    {en: 'run', cn: '跑'}, {en: 'walk', cn: '走'}, {en: 'jump', cn: '跳'},
    {en: 'eat', cn: '吃'}, {en: 'drink', cn: '喝'}, {en: 'sleep', cn: '睡觉'},
    {en: 'read', cn: '读'}, {en: 'write', cn: '写'}, {en: 'look', cn: '看'},
    {en: 'play', cn: '玩'}, {en: 'sing', cn: '唱歌'}, {en: 'draw', cn: '画画'},
    
    // 基础形容词
    {en: 'big', cn: '大的'}, {en: 'small', cn: '小的'}, {en: 'hot', cn: '热的'},
    {en: 'cold', cn: '冷的'}, {en: 'good', cn: '好的'}, {en: 'bad', cn: '坏的'},
    {en: 'new', cn: '新的'}, {en: 'old', cn: '旧的'}, {en: 'happy', cn: '开心的'},
    
    // 颜色
    {en: 'red', cn: '红色'}, {en: 'blue', cn: '蓝色'}, {en: 'green', cn: '绿色'},
    {en: 'yellow', cn: '黄色'}, {en: 'black', cn: '黑色'}, {en: 'white', cn: '白色'},
    
    // 数字
    {en: 'one', cn: '一'}, {en: 'two', cn: '二'}, {en: 'three', cn: '三'},
    {en: 'four', cn: '四'}, {en: 'five', cn: '五'}, {en: 'six', cn: '六'},
    {en: 'seven', cn: '七'}, {en: 'eight', cn: '八'}, {en: 'nine', cn: '九'},
    {en: 'ten', cn: '十'},
    
    // 自然与天气
    {en: 'sun', cn: '太阳'}, {en: 'moon', cn: '月亮'}, {en: 'star', cn: '星星'},
    {en: 'sky', cn: '天空'}, {en: 'rain', cn: '雨'}, {en: 'snow', cn: '雪'},
    {en: 'tree', cn: '树'}, {en: 'flower', cn: '花'},
    
    // 代词和常用词
    {en: 'I', cn: '我'}, {en: 'you', cn: '你'}, {en: 'he', cn: '他'},
    {en: 'she', cn: '她'}, {en: 'it', cn: '它'}, {en: 'we', cn: '我们'},
    {en: 'they', cn: '他们'}, {en: 'my', cn: '我的'}, {en: 'your', cn: '你的'},
    
    // 时间词
    {en: 'day', cn: '天'}, {en: 'week', cn: '周'}, {en: 'year', cn: '年'},
    {en: 'today', cn: '今天'}, {en: 'morning', cn: '早上'}, {en: 'night', cn: '晚上'},
    
    // 学校相关
    {en: 'school', cn: '学校'}, {en: 'class', cn: '班级'}, {en: 'student', cn: '学生'},
    {en: 'teacher', cn: '老师'}, {en: 'friend', cn: '朋友'},
    
    // 常用短语
    {en: 'hello', cn: '你好'}, {en: 'bye', cn: '再见'}, {en: 'yes', cn: '是'},
    {en: 'no', cn: '不'}, {en: 'please', cn: '请'}, {en: 'thank you', cn: '谢谢'},
    {en: 'sorry', cn: '对不起'}, {en: 'ok', cn: '好的'}
];

// 从单词库中随机获取一个单词
function getRandomWord() {
    const index = Math.floor(Math.random() * wordBank.length);
    return wordBank[index];
}

// 导出函数供其他文件使用
window.getRandomWord = getRandomWord;
window.wordBank = wordBank;
