import request from '@front/utils/request';
import { listenAdd, listenRemove, } from '@front/utils/wsManager';
import Respons from '@front/entitys/respons.entity';

/**
 * 撤销下注
 */
export function req_userCancel_bet(stageId, bootsNum, paveNum) {
  const data = {
    method: 'post',
    data: {
      stageId: stageId,
      bootsNum: bootsNum,
      paveNum: paveNum,
    },
    queryUrl: [
    ],
  }

  return request('/user/cancel_bet', data);
}

export function req_userJoinLog(page, line, startTime, endTime, status) {
  // const data = {
  //   method: 'post',
  //   data: {
  //     page: page,
  //     line: line,
  //     startTime: startTime,
  //     endTime: endTime,
  //     status: status,
  //   },
  //   queryUrl: [
  //   ],
  // }

  // return request('/user/joinLog', data);

  return new Promise(resolve=> {
    const _listenId = listenAdd(
      'betOrderList',
      {
        page: page,
        line: line,
        startTime: startTime,
        endTime: endTime,
        status: status,
      },
      (event)=> {
        listenRemove(_listenId);
        if (event.code !== 0) return resolve(Respons.setMsg(event.msg));

        return resolve(Respons.setData(event.data))
      }
    )
  })
}

// 视频验真
// export function req_postMsg(deskname, code) {
//   const data = {
//     method: 'post',
//     data: {
//       deskname: deskname,
//       code: code,
//     },
//     queryUrl: [
//     ],
//   }

//   return request('/postMsg', data);
// }
export function req_postMsg(deskname, code) {
  // const _formData = new FormData();
  // _formData.append('deskname', deskname);
  // _formData.append('code', code);

  const data = {
    method: 'post',
    // data: _formData,
    data: {
      deskname: deskname,
      code: code,
    },
    queryUrl: [
    ],
  }

  return request('/ajax.php', data);
}

// 问路
export function req_gameAskRoad(stageId, bootsNum, gameResult) {
  const data = {
    method: 'get',
    data: {
      stageId: stageId,
      bootsNum: bootsNum,
      gameResult: gameResult,
    },
    queryUrl: [
    ],
  }

  return request('/game/askRoad', data);
}
