import { MATCH_GAME_STATUS } from '@front/constants';
import { isString, isGetString, isGetNumber, } from '@front/utils/is';
import { getDewName } from '@front/utils/dew';

const _MATCH_BELONG_NAME = { // 匹配所属家
        '闲': 'xian',
        '庄': 'zhuang',
        '龙': 'long',
        '虎': 'hu',
      },
      _MATCH_DESK_TYPE_WITH_ROLE = {
        '闲': 'bjl',
        '庄': 'bjl',
        '龙': 'lh',
        '虎': 'lh',
      },
      // _MATCH_REAL_POINT = { // 匹配真实计算点数
      _MATCH_REAL_POINT_BJL = { // 匹配真实计算点数-bjl
        'J': 0,
        'Q': 0,
        'K': 0,
        '10': 10,
        'A': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
      },
      _MATCH_REAL_POINT_LH = { // 匹配真实计算点数-lh
        'J': 11,
        'Q': 12,
        'K': 13,
        '10': 10,
        'A': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
      },
      _MATCH_WIN_BET = {
        '闲赢': 'bet-xian',
        '闲对': 'bet-xiandui',
        '和局': 'bet-he',
        '庄对': 'bet-zhuangdui',
        '庄赢': 'bet-zhuang',
        '龙赢': 'bet-long',
        '虎赢': 'bet-hu',
        '龙单': 'bet-longdan',
        '虎单': 'bet-hudan',
        '龙双': 'bet-longshuang',
        '虎双': 'bet-hushuang',
      }
;

function _getBelongName(originName) {
  return (
    (!originName || !isString(originName)) ? '' :
    !(originName in _MATCH_BELONG_NAME) ? '' :
    _MATCH_BELONG_NAME[originName]
  );
}

function _getRealPoint(originRoleName, originCardName) {
  const _deskType = (
    originRoleName && isString(originRoleName) && (originRoleName in _MATCH_DESK_TYPE_WITH_ROLE)
      ? _MATCH_DESK_TYPE_WITH_ROLE[originRoleName]
      : ''
  )

  return (
    (!originCardName || !isString(originCardName)) ? '' :
    (!_deskType) ? '' :
    (
      (_deskType === 'bjl' ? _MATCH_REAL_POINT_BJL : (_deskType === 'lh' ? _MATCH_REAL_POINT_LH : {}))[originCardName.substring(2)] || 0
    )
  );
}

// function _genDewListFirst(originList, onlyNewItem=false) {
function _genDewListFirst(originList, onlyNewItem=false, isNoCommissionDesk=false) {
  let _list = (
    originList
      .slice(onlyNewItem ? -2 : 0)
      .slice(onlyNewItem ? 1 : 0)
  )

  isNoCommissionDesk && (_list = _list.map(f=> {
    return f.split(',').filter(f=> !f.includes('幸运')).join(',');
  }))

  return _list;
}

function _genDewListSecond(originList, onlyNewItem=false) {
  let _lastIndex = NaN;
  return (
    Object.keys(originList || {})
      .slice(onlyNewItem ? -2 : 0)
      .reduce((a,b)=> {
        !isNaN(_lastIndex) && (b - _lastIndex) > 1 && (
          a = a.concat(new Array((b - _lastIndex - 1)).fill(false))
        )

        _lastIndex = b;

        a.push({
          img: originList[b].qiuImgName || (originList[b].qiuColor ? getDewName(`大路${originList[b].qiuColor}`, true) : ''),
          heCount: originList[b].heCount > 0 ? originList[b].heCount : NaN,
          lastColumn: originList[b].realRow > 6,
          xyCount: Number(`${originList[b].realColumn}${originList[b].realRow}`)
        });
        return a;
      }, [])
      .slice(onlyNewItem ? 1 : 0)
  )
}

function _genDewListThird(originList, onlyNewItem=false) {
  let _lastIndex = NaN;
  return (
    Object.keys(originList || {})
      .slice(onlyNewItem ? -2 : 0)
      .reduce((a,b)=> {
        !isNaN(_lastIndex) && (b - _lastIndex) > 1 && (
          a = a.concat(new Array((b - _lastIndex - 1)).fill(false))
        )

        _lastIndex = b;

        a.push(originList[b]);
        return a;
      }, [])
      .slice(onlyNewItem ? 1 : 0)
  )
}

function _genDewListFourth(originList, onlyNewItem=false) {
  let _lastIndex = NaN;
  return (
    Object.keys(originList || {})
      .slice(onlyNewItem ? -2 : 0)
      .reduce((a,b)=> {
        !isNaN(_lastIndex) && (b - _lastIndex) > 1 && (
          a = a.concat(new Array((b - _lastIndex - 1)).fill(false))
        )

        _lastIndex = b;

        a.push(originList[b]);
        return a;
      }, [])
      .slice(onlyNewItem ? 1 : 0)
  )
}

function _genDewListFifth(originList, onlyNewItem=false) {
  let _lastIndex = NaN;
  return (
    Object.keys(originList || {})
      .slice(onlyNewItem ? -2 : 0)
      .reduce((a,b)=> {
        !isNaN(_lastIndex) && (b - _lastIndex) > 1 && (
          a = a.concat(new Array((b - _lastIndex - 1)).fill(false))
        )

        _lastIndex = b;

        a.push(originList[b]);
        return a;
      }, [])
      .slice(onlyNewItem ? 1 : 0)
  )
}

function _genDewListSixth(originList, onlyNewItem=false) {
  let _lastIndex = NaN;
  return (
    Object.keys(originList || {})
      .slice(onlyNewItem ? -2 : 0)
      .reduce((a,b)=> {
        !isNaN(_lastIndex) && (b - _lastIndex) > 1 && (
          a = a.concat(new Array((b - _lastIndex - 1)).fill(false))
        )

        _lastIndex = b;

        a.push({
          img: originList[b].qiuImgName || (originList[b].qiuColor ? getDewName(`大路${originList[b].qiuColor}`, true) : ''),
          heCount: originList[b].heCount > 0 ? originList[b].heCount : NaN,
          lastColumn: originList[b].realRow > 6,
          xyCount: Number(`${originList[b].realColumn}${originList[b].realRow}`)
        });
        return a;
      }, [])
      .slice(onlyNewItem ? 1 : 0)
  )
}

const _ep = {

  stageInfo(data) {
    const _isNoCommissionDesk = data.freeCommissionPlay === '否',
          _riTotalItem = data.gambleResultCount?.find(f=> f.name === '总数'),
          _riXianItem = data.gambleResultCount?.find(f=> f.name === '闲'),
          _riZhuangItem = data.gambleResultCount?.find(f=> f.name === '庄'),
          _riHeItem = data.gambleResultCount?.find(f=> f.name === '和'),
          _riXianDuiItem = data.gambleResultCount?.find(f=> f.name === '闲对'),
          _riZhuangDuiItem = data.gambleResultCount?.find(f=> f.name === '庄对'),
          _riLongItem = data.gambleResultCount?.find(f=> f.name === '龙'),
          _riHuItem = data.gambleResultCount?.find(f=> f.name === '虎')
    ;

    return Object.assign(
      data,
      {
        _front: {
          _gameStatus: data.stageState === 1 ? 'stopDesk' : MATCH_GAME_STATUS[data.playStatus],
          _roundInfo: {
            _totalNum: _riTotalItem ? _riTotalItem.num : NaN,
            _xianNum: _riXianItem ? _riXianItem.num : NaN,
            _zhuangNum: _riZhuangItem ? _riZhuangItem.num : NaN,
            _heNum: _riHeItem ? _riHeItem.num : NaN,
            _xianDuiNum: _riXianDuiItem ? _riXianDuiItem.num : NaN,
            _zhuangDuiNum: _riZhuangDuiItem ? _riZhuangDuiItem.num : NaN,
            _longNum: _riLongItem ? _riLongItem.num : NaN,
            _huNum: _riHuItem ? _riHuItem.num : NaN,
          },
          _dewListFirst: _genDewListFirst(data.gambleResultList, false, _isNoCommissionDesk),
          _dewListSecond: _genDewListSecond(data.dlImgResult, false),
          _dewListThird: _genDewListThird(data.dyzImg, false),
          _dewListFourth: _genDewListFourth(data.xlImg, false),
          _dewListFifth: _genDewListFifth(data.xqlImg, false),
          _dewListSixth: _genDewListSixth(data.sxlImgResult, false, _isNoCommissionDesk),
          _pokerList: (
            (data.gameCardList || []).map(f=> {
              return this.type.addCard({
                cardName: f.gameCardName,
                cardIndex: Number(f.gameCardSequence),
                roleName: f.gameRole,
              })
            })
          ),
        },
      },
      {
        gambleResultList: undefined,
        dlImgResult: undefined,
        dyzImg: undefined,
        xlImg: undefined,
        xqlImg: undefined,
        sxlImgResult: undefined,
      }
    )
  },

  stageList(data) {
    return this.stageInfo(data);
  },

  type: {
    readyOpenCards(/*data*/) {
      return {
      }
    },

    startBet(data) {
      return {
        betTimeLimit: data.betTimeLimit,
        betStartTime: data.betStartTime,
        currentTime: data.currentTime,
        bootsNum: data.bootsNum,
        paveNum: data.paveNum,
        isPrivateIng: data.privateStage === '是',
        canJoinPlayerList: (data.privateStagePlayer || '').split(','),
      }
    },

    addCard(data) {
      const _cardIndex = isGetNumber(data.cardIndex, NaN),
            _belongName = _getBelongName(data.roleName)
      ;

      return {
        cardName: isGetString(data.cardName, ''), // 卡牌名称 (方片3)
        cardIndex: _cardIndex, // 卡牌所属家第几张 (1)
        cardPoint: _getRealPoint(data.roleName, data.cardName),
        belongName: _belongName, // 卡牌所属家 (xian, zhuang, long, hu)
        _front: {
          _pokerInfoCardNameField: (
            _belongName === 'xian' ? `bjlXian0${_cardIndex}` : 
            _belongName === 'zhuang' ? `bjlZhuang0${_cardIndex}` : 
            _belongName === 'long' ? `lhLong0${_cardIndex}` : 
            _belongName === 'hu' ? `lhHu0${_cardIndex}` : 
            ''
          ),
          _pokerInfoTotalField: (
            _belongName === 'xian' ? 'bjlXianTotal' : 
            _belongName === 'zhuang' ? 'bjlZhuangTotal' : 
            _belongName === 'long' ? 'lhLongTotal' : 
            _belongName === 'hu' ? 'lhHuTotal' : 
            ''
          )
        }
      }
    },

    gambleSettle(data) {
      const _riTotalItem = data.gambleResultCount?.find(f=> f.name === '总数'),
            _riXianItem = data.gambleResultCount?.find(f=> f.name === '闲'),
            _riZhuangItem = data.gambleResultCount?.find(f=> f.name === '庄'),
            _riHeItem = data.gambleResultCount?.find(f=> f.name === '和'),
            _riXianDuiItem = data.gambleResultCount?.find(f=> f.name === '闲对'),
            _riZhuangDuiItem = data.gambleResultCount?.find(f=> f.name === '庄对'),
            _riLongItem = data.gambleResultCount?.find(f=> f.name === '龙'),
            _riHuItem = data.gambleResultCount?.find(f=> f.name === '虎')
      ;

      return {
        stageId: data.stageId,
        voiceSrc: data.voiceSrc || [],
        xianAsk: data.xianAsk || [],
        zhuangAsk: data.zhuangAsk || [],
        newDewListFirstArr: _genDewListFirst(data.gambleResultList, /*true*/false, false),
        newDewListSecondArr: _genDewListSecond(data.dlImgResult, /*true*/false),
        newDewListThirdArr: _genDewListThird(data.dyzImg, /*true*/false),
        newDewListFourthArr: _genDewListFourth(data.xlImg, /*true*/false),
        newDewListFifthArr: _genDewListFifth(data.xqlImg, /*true*/false),
        newDewListSixthArr: _genDewListSixth(data.sxlImgResult, false),
        _front: {
          _roundInfo: {
            _totalNum: _riTotalItem ? _riTotalItem.num : NaN,
            _xianNum: _riXianItem ? _riXianItem.num : NaN,
            _zhuangNum: _riZhuangItem ? _riZhuangItem.num : NaN,
            _heNum: _riHeItem ? _riHeItem.num : NaN,
            _xianDuiNum: _riXianDuiItem ? _riXianDuiItem.num : NaN,
            _zhuangDuiNum: _riZhuangDuiItem ? _riZhuangDuiItem.num : NaN,
            _longNum: _riLongItem ? _riLongItem.num : NaN,
            _huNum: _riHuItem ? _riHuItem.num : NaN,
          },
          _winBetArrs: (
            ('gambleResult' in data ? data.gambleResult.split(',') : [])
              .map(f=> _MATCH_WIN_BET[f])
                .filter(f=> isString(f))
          ),
        },
      }
    },

    playerBetResult(data) {
      return {
        _front: {
          _winAmount: isGetNumber(data.amount, NaN),
        }
      }
    },

    askRoute(data) {
      const _firstArr = _genDewListFirst(data.gambleResultList, false, false),
            _secondArr = _genDewListSecond(data.dlImgResult, false)
      ;
      if (_firstArr[_firstArr.length - 1] === '虎赢,大') {
        _secondArr[_secondArr.length-1].img = '大路虎赢.png';
      } else if (_firstArr[_firstArr.length - 1] === '龙赢,大') {
        _secondArr[_secondArr.length-1].img = '大路龙赢.png';
      }
      return {
        voiceSrc: data.voiceSrc || [],
        newDewListFirstArr: _firstArr,
        newDewListSecondArr: _secondArr,
        newDewListThirdArr: _genDewListThird(data.dyzImg, false),
        newDewListFourthArr: _genDewListFourth(data.xlImg, false),
        newDewListFifthArr: _genDewListFifth(data.xqlImg, false),
        newDewListSixthArr: _genDewListSixth(data.sxlImgResult, false),
      }
    },
  }

}

export default _ep;
