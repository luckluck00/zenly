const memberService = require('../service/MemberService');
const memberHistoryService = require('../service/MemberHistoryService');
const webCrypto = require('../helpers/WebCrypto');
const auth = require('../helpers/Auth');
const memberRoleSerivce = require('../service/MemberRoleService');

exports.query = async (req, res) => {
  res.set('Content-Security-Policy', 'default-src \'self\'');
  /*
        #swagger.tags = ['Member']
        #swagger.parameters['query'] = {
            in: 'body',
            description: '',
            schema: {
                        currentPage: '第幾頁',
                        pageSize: '頁面長度',
                        sort:'欄位',
                        dir:'true or false',
                        startDate: '查詢起始',
                        endDate: '查詢結束',
                        account: '帳號',
                        email: '信箱',
                        name: '名稱',
            }
        }
  */
  try {
    const obj = req.body;
    obj.attributes =['id', 'account', 'name', 'realName', 'email', 'spareEmail', 'mobilePhone', 'cityPhone', 'cityPhoneExt', 'address', 'isEnable'];
    const state = await memberService.query(obj);
    if (state) {
      return res.status(200).json(state);
    }
    return res.status(500).json({message: 'Internal Server Error'});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};

exports.queryByPk = async (req, res) => {
  res.set('Content-Security-Policy', 'default-src \'self\'');
  /*
        #swagger.tags = ['Member']
        #swagger.parameters['id'] = {
            description: 'id查詢',
        }
  */
  try {
    let state = {};
    // 判斷角色權限系統管理員不需要另外判斷
    if (req.roleTitle === auth.Role.SuperAdmin) {
      state = await memberService.queryByPk(req.params.id);
      const memberRole = await memberRoleSerivce.query({
        memberId: req.params.id,
      });

      // console.log(memberRole.rows);
      const memberRoleArrayId = memberRole.rows.map((row) => (row.roleId));
      state.dataValues.roleIdList = memberRoleArrayId;
    }
    if (state) {
      return res.status(200).json(state);
    }
    return res.status(200).json({});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};

exports.delete = async (req, res) => {
  res.set('Content-Security-Policy', 'default-src \'self\'');
  /*
        #swagger.tags = ['Member']
        #swagger.parameters['delete'] = {
            in: 'body',
            description: '',
            schema: {
                        id: '主鍵編號'
            }
        }
  */
  try {
    if (!req.body.id) {
      return res.status(400).json({
        message: 'Content can not be empty!',
      });
    }

    const state = await memberService.delete(req.body);
    if (state) {
      return res.status(200).json(state);
    }
    return res.status(500).json({message: 'Internal Server Error'});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};

exports.update = async (req, res) => {
  res.set('Content-Security-Policy', 'default-src \'self\'');
  /*
        #swagger.tags = ['Member']
        #swagger.parameters['update'] = {
            in: 'body',
            description: '',
            schema: {
                        $account: '帳號',
                        $name: '暱稱',
                        realName: '真實姓名',
                        $email: '信箱',
                        spareEmail: '備用信箱',
                        mobilePhone: '電話',
                        cityPhone: '室內電話',
                        cityPhoneEx: '分機',
                        address: '地址',
                        isEnable: '啟用不啟用'
            }
        }
  */
  try {
    const state = await memberService.update(req.body);
    if (state) {
      return res.status(200).json(state);
    }
    return res.status(500).json({message: 'Internal Server Error'});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};

exports.fields = async (req, res) => {
  res.set('Content-Security-Policy', 'default-src \'self\'');
  /*
        #swagger.tags = ['Member']
        #swagger.parameters['select all fields'] = {
            in: 'body',
            description: '獲得欄位資訊',
            schema: {

            }
        }
  */
  try {
    const state = await memberService.fields(req.body);
    if (state) {
      return res.status(200).json(state);
    }
    return res.status(500).json({message: 'Internal Server Error'});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};


exports.userUpdate = async (req, res) => {
  res.set('Content-Security-Policy', 'default-src \'self\'');
  /*
        #swagger.tags = ['Member']
        #swagger.parameters['userUpdate'] = {
            in: 'body',
            description: '不需要帶入id 系統會自動帶入，這隻api是提供修改個人資訊使用',
            schema: {
                        $account: '帳號',
                        $name: '暱稱',
                        realName: '真實姓名',
                        $email: '信箱',
                        spareEmail: '備用信箱',
                        mobilePhone: '電話',
                        cityPhone: '室內電話',
                        cityPhoneEx: '分機',
                        address: '地址',
                        isEnable: '啟用不啟用'
            }
        }
  */
  try {
    const obj = req.body;
    obj.id = req.decoded.memberId;
    const state = await memberService.update(obj);
    if (state) {
      return res.status(200).json(state);
    }
    return res.status(500).json({message: 'Internal Server Error'});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};


exports.editePassword = async (req, res) => {
  res.set('Content-Security-Policy', 'default-src \'self\'');
  /*
        #swagger.tags = ['Member']
        #swagger.parameters['editePassword'] = {
            in: 'body',
            description: '不需要帶入id 系統會自動帶入，這隻api是提供修改個人密碼',
            schema: {
                        $oldPassword: '密碼',
                        $password: '密碼',
                        $checkPassword: '確認密碼',
            }
        }
  */
  try {
    const obj = req.body;
    obj.id = req.decoded.memberId;

    const memberHistory = await memberHistoryService.queryByMemberId(req.decoded.memberId);
    if (webCrypto.getHash(webCrypto.HashType.SHA512, obj.oldPassword + memberHistory.salt) !== memberHistory.password) {
      return res.status(418).json({message: 'The original password is wrong'});
    }
    obj.salt = webCrypto.generateUUID();
    obj.password = webCrypto.getHash(webCrypto.HashType.SHA512, obj.password + obj.salt);
    const state = await memberHistoryService.update(obj);
    if (state) {
      return res.status(200).json(state);
    }
    return res.status(500).json({message: 'Internal Server Error'});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};

exports.userByPk = async (req, res) => {
  res.set('Content-Security-Policy', 'default-src \'self\'');
  /*
        #swagger.tags = ['Member']
        #swagger.parameters['id'] = {
            description: 'id查詢',
        }
  */
  try {
    const state = await memberService.queryByPk(req.decoded.memberId);
    if (state) {
      return res.status(200).json(state);
    }
    return res.status(200).json({});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};


exports.updateAndPower = async (req, res) => {
  res.set('Content-Security-Policy', 'default-src \'self\'');
  /*
        #swagger.tags = ['Member']
        #swagger.parameters['obj'] = {
            in: 'body',
            description: '更新權限',
            schema: {
                        $account: '帳號',
                        $name: '暱稱',
                        realName: '真實姓名',
                        $email: '信箱',
                        spareEmail: '備用信箱',
                        mobilePhone: '電話',
                        cityPhone: '室內電話',
                        cityPhoneEx: '分機',
                        address: '地址',
                        isEnable: '啟用不啟用',
                        rolePowerList: '啟用的權限Id(JSON)'
            }
        }
  */
  try {
    const state = await memberService.updateAndPower(req.body);
    if (state) {
      return res.status(200).json(state);
    }
    return res.status(500).json({message: 'Internal Server Error'});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};

exports.create = async (req, res) => {
  res.set('Content-Security-Policy', 'default-src \'self\'');
  /*
        #swagger.tags = ['Member']
        #swagger.parameters['obj'] = {
            in: 'body',
            description: '新增帳號',
            schema: {
                        $account: '帳號',
                        $name: '暱稱',
                        realName: '真實姓名',
                        $email: '信箱',
                        spareEmail: '備用信箱',
                        mobilePhone: '電話',
                        cityPhone: '室內電話',
                        cityPhoneEx: '分機',
                        address: '地址',
                        $password: '密碼',
                        $checkPassword: '確認密碼',
                        rolePowerList: '啟用的權限Id(JSON)'
            }
        }
  */
  try {
    const state = await memberService.create(req.body);
    if (state) {
      return res.status(201).json({state});
    }
    return res.status(500).json({message: 'Internal Server Error'});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
};
