class Respons {

  constructor() {
    this.success = false;
    this.data = {};
    this.msg = '';
    this.code = NaN;
  }
  static setSuccess(success=false, msg='') {
    const respons = new Respons();
    respons.success = success;
    msg ? respons.msg = msg : '';
    return respons;
  }
  static setData(data={}, msg='', code=NaN) {
    const respons = new Respons();
    respons.success = true;
    respons.data = data;
    respons.msg = msg;
    respons.code = code;
    return respons;
  }
  static setMsg(msg='', data={}, code=NaN) {
    const respons = new Respons();
    respons.msg = msg;
    data ? respons.data = data : '';
    respons.code = code;
    return respons;
  }
  static setCode(code=NaN) {
    const respons = new Respons();
    respons.code = code;
    return respons;
  }
}

export default Respons;
