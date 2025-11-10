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

const _ROAD_IMG_NAME = {
  banker: '大路庄赢',
  player: '大路闲赢',
  dragon: '大路龙赢',
  tiger: '大路虎赢',
};

const _DERIVED_ROAD_IMG = {
  bigEye: {
    red: 'dayanzailuhongse.png',
    blue: 'dayanzailulanse.png',
  },
  small: {
    red: 'xiaoluhongse.png',
    blue: 'xiaolulanse.png',
  },
  cockroach: {
    red: 'xiaoqiangluhongse.png',
    blue: 'xiaoqianglulanse.png',
  },
};

function _parseDewListFirstForRoad(list=[]) {
  const _result = [];

  list.forEach(item=> {
    if (!item) return;
    const _str = item.toString();

    if (_str.includes('和局') && !_str.includes('赢')) {
      _result.length > 0 && (_result[_result.length - 1].tieCount += 1);
      return;
    }

    const _winner = (
      _str.includes('庄赢') ? 'banker' :
      _str.includes('闲赢') ? 'player' :
      _str.includes('龙赢') ? 'dragon' :
      _str.includes('虎赢') ? 'tiger' :
      ''
    );

    if (!_winner) return;

    _result.push({
      winner: (
        _winner === 'dragon' ? 'banker' :
        _winner === 'tiger' ? 'player' :
        _winner
      ),
      bankerPair: _str.includes('庄对'),
      playerPair: _str.includes('闲对'),
      tieCount: 0,
    });
  });

  return _result;
}

function _buildBigRoadColumns(units=[]) {
  const _columns = [];
  const _sequence = [];
  let _currentCol = -1;
  let _currentRow = 0;
  let _lastWinner = '';
  let _currentRunLength = 0;

  units.forEach(unit => {
    if (!unit || !unit.winner) return;

    if (!_lastWinner) {
      _currentCol = 0;
      _currentRow = 0;
      _currentRunLength = 1;
      _lastWinner = unit.winner;
    } else if (unit.winner === _lastWinner) {
      _currentRunLength += 1;
      const _column = _columns[_currentCol] || (_columns[_currentCol] = []);
      const _nextRow = _currentRow + 1;
      if (_nextRow < 6 && !_column[_nextRow]) {
        _currentRow = _nextRow;
      } else {
        _currentCol += 1;
      }
    } else {
      _lastWinner = unit.winner;
      _currentCol += 1;
      _currentRow = 0;
      _currentRunLength = 1;
    }

    if (!_columns[_currentCol]) {
      _columns[_currentCol] = [];
    }

    const _cell = Object.assign({}, unit, {
      columnIndex: _currentCol,
      rowIndex: _currentRow,
      realRow: _currentRunLength,
    });
    _columns[_currentCol][_currentRow] = _cell;
    _sequence.push(_cell);
  });

  return { columns:_columns, sequence:_sequence };
}

function _buildDerivedSequence(columns, sequence, lookback) {
  const _derived = [];

  sequence.forEach(cell => {
    const _color = _calcDerivedColor(columns, cell.columnIndex, cell.rowIndex, lookback);
    _color && _derived.push(_color);
  });

  return _derived;
}

function _calcDerivedColor(columns, columnIndex, rowIndex, lookback) {
  if (columnIndex < 1) return '';

  if (rowIndex === 0) {
    const _leftIndex = columnIndex - 1;
    const _compareIndex = columnIndex - lookback - 1;
    if (_compareIndex < 0) return '';

    const _leftLen = _getColumnLength(columns, _leftIndex);
    const _compareLen = _getColumnLength(columns, _compareIndex);
    return _leftLen === _compareLen ? 'red' : 'blue';
  }

  const _compareIndex = columnIndex - lookback;
  if (_compareIndex < 0) return '';

  const _compareColumn = columns[_compareIndex];
  return (_compareColumn && _compareColumn[rowIndex]) ? 'red' : 'blue';
}

function _buildSimpleRoadColumns(sequence=[]) {
  const _columns = [];
  let _currentCol = -1;
  let _currentRow = 0;
  let _lastValue = '';

  sequence.forEach(value => {
    if (!value) return;

    if (!_lastValue) {
      _currentCol = 0;
      _currentRow = 0;
      _lastValue = value;
    } else if (value === _lastValue) {
      const _column = _columns[_currentCol] || (_columns[_currentCol] = []);
      const _nextRow = _currentRow + 1;
      if (_nextRow < 6 && !_column[_nextRow]) {
        _currentRow = _nextRow;
      } else {
        _currentCol += 1;
      }
    } else {
      _lastValue = value;
      _currentCol += 1;
      _currentRow = 0;
    }

    if (!_columns[_currentCol]) {
      _columns[_currentCol] = [];
    }
    _columns[_currentCol][_currentRow] = {
      value: value,
      columnIndex: _currentCol,
      rowIndex: _currentRow,
    };
  });

  return _columns;
}

function _getColumnLength(columns, index) {
  const _column = columns[index];
  if (!_column) return 0;
  return _column.reduce((acc, cell)=> acc + (cell ? 1 : 0), 0);
}

function _flattenColumns(columns=[], mapFunc) {
  const _result = [];
  const _cols = columns || [];

  for (let colIndex = 0; colIndex < _cols.length; colIndex += 1) {
    const _column = _cols[colIndex] || [];
    for (let rowIndex = 0; rowIndex < 6; rowIndex += 1) {
      const _cell = _column[rowIndex];
      if (_cell) {
        _result.push(mapFunc(_cell, colIndex, rowIndex));
      } else {
        _result.push(false);
      }
    }
  }

  while (_result.length > 0 && _result[_result.length - 1] === false) {
    _result.pop();
  }

  return _result;
}

function _getBigRoadImgName(cell) {
  const _baseName = _ROAD_IMG_NAME[cell.winner] || _ROAD_IMG_NAME.banker;
  const _suffix = (
    cell.winner === 'banker' && cell.bankerPair ? '庄对' :
    cell.winner === 'player' && cell.playerPair ? '闲对' :
    ''
  );
  return getDewName(`${_baseName}${_suffix}`, true);
}

function _buildRoadFromFirst(dewListFirst=[]) {
  return _buildRoadFromUnits(_parseDewListFirstForRoad(dewListFirst));
}

function _buildRoadFromSecond(dewListSecond=[]) {
  return _buildRoadFromUnits(_parseDewListSecondForRoad(dewListSecond));
}

function _buildRoadFromUnits(units=[]) {
  if (!Array.isArray(units) || units.length < 1) {
    return _getEmptyRoad();
  }

  const { columns, sequence } = _buildBigRoadColumns(units);
  const _dewListSecond = _flattenColumns(columns, (cell, colIndex, rowIndex)=> ({
    img: _getBigRoadImgName(cell),
    heCount: cell.tieCount > 0 ? cell.tieCount : NaN,
    lastColumn: cell.realRow > 6,
    xyCount: Number(`${colIndex + 1}${Math.min(rowIndex + 1, 6)}`),
  }));

  const _dewListSixth = sequence.map(cell => ({
    img: _getBigRoadImgName(cell),
    heCount: cell.tieCount > 0 ? cell.tieCount : NaN,
    lastColumn: cell.realRow > 6,
    xyCount: 0,
  }));

  const _bigEyeSequence = _buildDerivedSequence(columns, sequence, 1);
  const _smallRoadSequence = _buildDerivedSequence(columns, sequence, 2);
  const _cockroachSequence = _buildDerivedSequence(columns, sequence, 3);

  const _dewListThird = _flattenColumns(_buildSimpleRoadColumns(_bigEyeSequence), (cell)=> {
    return _DERIVED_ROAD_IMG.bigEye[cell.value] || false;
  });
  const _dewListFourth = _flattenColumns(_buildSimpleRoadColumns(_smallRoadSequence), (cell)=> {
    return _DERIVED_ROAD_IMG.small[cell.value] || false;
  });
  const _dewListFifth = _flattenColumns(_buildSimpleRoadColumns(_cockroachSequence), (cell)=> {
    return _DERIVED_ROAD_IMG.cockroach[cell.value] || false;
  });

  return {
    dewListSecond: _dewListSecond,
    dewListThird: _dewListThird,
    dewListFourth: _dewListFourth,
    dewListFifth: _dewListFifth,
    dewListSixth: _dewListSixth,
  };
}

function _parseDewListSecondForRoad(list=[]) {
  if (!Array.isArray(list)) return [];
  return list.reduce((arr, item)=> {
    if (!item || !item.img) return arr;
    const _winner = _getWinnerFromImg(item.img);
    if (!_winner) return arr;

    const _imgName = (item.img || '').toLowerCase();

    arr.push({
      winner: _winner,
      bankerPair: _imgName.includes('zhuangdui'),
      playerPair: _imgName.includes('xiandui'),
      tieCount: isNaN(item.heCount) ? 0 : Number(item.heCount),
    });
    return arr;
  }, []);
}

function _getWinnerFromImg(imgName='') {
  if (!imgName) return '';
  const _name = imgName.toLowerCase().replace(/-/g, '');
  return (
    _name.includes('zhuangying') ? 'banker' :
    _name.includes('xianying') ? 'player' :
    _name.includes('longying') ? 'banker' :
    _name.includes('huying') ? 'player' :
    ''
  );
}

function _getEmptyRoad() {
  return {
    dewListSecond: [],
    dewListThird: [],
    dewListFourth: [],
    dewListFifth: [],
    dewListSixth: [],
  };
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

    const _dewListFirst = _genDewListFirst(data.gambleResultList, false, _isNoCommissionDesk),
          _hasOriginData = origin=> origin && Object.keys(origin).length > 0
    ;

    const _hasDlImg = _hasOriginData(data.dlImgResult);
    let _dewListSecond = [];
    if (_hasDlImg) {
      _dewListSecond = _genDewListSecond(data.dlImgResult, false);
    } else {
      const _roadFromFirst = _buildRoadFromFirst(_dewListFirst);
      _dewListSecond = _roadFromFirst.dewListSecond;
    }
    const _roadFromSecond = _buildRoadFromSecond(_dewListSecond);

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
          _dewListFirst: _dewListFirst,
          _dewListSecond: _dewListSecond,
          _dewListThird: _hasOriginData(data.dyzImg) ? _genDewListThird(data.dyzImg, false) : _roadFromSecond.dewListThird,
          _dewListFourth: _hasOriginData(data.xlImg) ? _genDewListFourth(data.xlImg, false) : _roadFromSecond.dewListFourth,
          _dewListFifth: _hasOriginData(data.xqlImg) ? _genDewListFifth(data.xqlImg, false) : _roadFromSecond.dewListFifth,
          _dewListSixth: _hasOriginData(data.sxlImgResult) ? _genDewListSixth(data.sxlImgResult, false, _isNoCommissionDesk) : _roadFromSecond.dewListSixth,
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
