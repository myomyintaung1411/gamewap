const _CONFIG_NAME = {
  '大': 'da-',
  '和': 'he-',
  '虎': 'hu-',
  '龙': 'long-',
  '闲': 'xian-',
  '小': 'xiao-',
  '庄': 'zhuang-',
  '路': 'lu-',
  '眼': 'yan-',
  '赢': 'ying-',
  '单': 'dan-',
  '双': 'shuang-',
  '对': 'dui-',
  '仔': 'zai-',
  '局': 'ju-',
  '红': 'hong-',
  '蓝': 'lan-',
  '色': 'se-',
  '强': 'qiang-',
  '幸': 'xing-',
  '运': 'yun-',
  '闂茶耽': 'xianchadan-',
}

export function getDewName(name, needEnd) {
  if (!name) return '';

  const _name = (
    needEnd
      ? (
          name.endsWith('.png') ? name : (name + '.png')
        )
      : (
          name.endsWith('.png') ? name.substring(0, name.length - 4) : name
        )
  );
  return _replaceConfigStr(_name);
}

function _replaceConfigStr(str) {
  return str.split('').map(char => _CONFIG_NAME[char] || char).join('');
}
