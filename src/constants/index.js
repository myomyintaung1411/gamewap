export const MATCH_GAME_STATUS = { // 游戏状态标记
  0: 'comeStart',
  1: 'timing',
  2: 'stopBetting',
  3: 'opening',
  4: 'settlement',
  5: 'repeal',
  6: 'shuffle',
}

export const MATCH_GAME_STATUS_NAME = { // 游戏状态说明
  // 'stopDesk': '停台中',
  // 'comeStart': '即将开局',
  // 'timing': '计时中',
  // 'stopBetting': '停止下注',
  // 'opening': '开牌中',
  // 'settlement': '结算中',
  // 'repeal': '废除牌局',
  // 'shuffle': '洗牌中',

  'stopDesk': 'time_status.stop',
  'comeStart': 'time_status.about_start',
  'timing': 'time_status.timing',
  'stopBetting': 'time_status.stop_bet',
  'opening': 'time_status.open',
  'settlement': 'time_status.settle',
  'repeal': 'time_status.Abolition',
  'shuffle': 'time_status.shuffle',
}

export const BET_LIST_BJL = ()=> ([
  { ident:'bet-xian', iconTypeShallow:'betarea-xian-shallow', iconTypeBright:'betarea-xian-deep', iconRate:'betrate-xian-shallow', nameZh:'闲', },
  { ident:'bet-xiandui', iconTypeShallow:'betarea-xiandui-shallow', iconTypeBright:'betarea-xiandui-deep', iconRate:'betrate-xiandui-shallow', nameZh:'闲对', },
  { ident:'bet-he', iconTypeShallow:'betarea-he-shallow', iconTypeBright:'betarea-he-deep', iconRate:'betrate-he-shallow', nameZh:'和', },
  { ident:'bet-zhuangdui', iconTypeShallow:'betarea-zhuangdui-shallow', iconTypeBright:'betarea-zhuangdui-deep', iconRate:'betrate-zhuangdui-shallow', nameZh:'庄对', },
  { ident:'bet-zhuang', iconTypeShallow:'betarea-zhuang-shallow', iconTypeBright:'betarea-zhuang-deep', iconRate:'betrate-zhuang-shallow', nameZh:'庄', },
  { ident:'bet-xingyun', iconTypeShallow:'', iconTypeBright:'', iconRate:'', nameZh:'幸运6', },
])

export const BET_LIST_LH = ()=> ([
  { ident:'bet-long', iconTypeShallow:'betarea-long-shallow', iconTypeBright:'betarea-long-deep', iconRate:'betrate-long-shallow', nameZh:'龙', },
  { ident:'bet-he', iconTypeShallow:'betarea-he-shallow', iconTypeBright:'betarea-he-deep', iconRate:'betrate-he-shallow', nameZh:'和', },
  { ident:'bet-hu', iconTypeShallow:'betarea-hu-shallow', iconTypeBright:'betarea-hu-deep', iconRate:'betrate-hu-shallow', nameZh:'虎', },
  { ident:'bet-longdan', iconTypeShallow:'betarea-long-dan-shallow', iconTypeBright:'betarea-long-dan-deep', iconRate:'betrate-long-dan-shallow', nameZh:'龙单', },
  { ident:'bet-hudan', iconTypeShallow:'betarea-hu-dan-shallow', iconTypeBright:'betarea-hu-dan-deep', iconRate:'betrate-hu-dan-shallow', nameZh:'虎单', },
  { ident:'bet-longshuang', iconTypeShallow:'betarea-long-shuang-shallow', iconTypeBright:'betarea-long-shuang-deep', iconRate:'betrate-long-shuang-shallow', nameZh:'龙双', },
  { ident:'bet-hushuang', iconTypeShallow:'betarea-hu-shuang-shallow', iconTypeBright:'betarea-hu-shuang-deep', iconRate:'betrate-hu-shuang-shallow', nameZh:'虎双', },
])
