const db = require('../models');
const Member = db.member;

exports.create = async (obj) => {
    const nowTime = moment().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
    const t = await sequelize.transaction();
    obj.createTime = nowTime;
    obj.modifyTime = nowTime;
    try {
      const member = await Member.create(obj, {transaction: t});
      await t.commit();
      return power;
    } catch (e) {
      console.log('\x1b[31m%s\x1b[0m', e);
      await t.rollback();
    }
  };
  
  exports.query = async (obj) => {
    try {
      const {currentPage, pageSize, dir = false, sort = 'id', startDate, endDate, attributes, ...where} = obj;
      const select = {where: {}};
  
      if (attributes) {
        select.attributes = attributes;
      }
      if (Object.keys(where).length > 0) {
        select.where = where;
      }
      if (startDate || endDate) {
        select.where.createTime = getDateRange(startDate, endDate);
      }
  
      if (currentPage && pageSize) {
        select.offset = (currentPage - 1) * pageSize;
        select.limit = pageSize;
      }
  
      select.order = [[sort, dir ? 'DESC' : 'ASC']];
  
      const member = await Member.findAndCountAll(select);
      return member;
    } catch (e) {
      console.log('\x1b[31m%s\x1b[0m', e);
    }
  };
  
  exports.queryByPk = async (id) => {
    try {
      const member = await ViewPower.findByPk(id);
      return member;
    } catch (e) {
      console.log('\x1b[31m%s\x1b[0m', e);
    }
  };
  
  exports.update = async (obj) =>{
    const nowTime = moment().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
    const t = await sequelize.transaction();
    obj.modifyTime = nowTime;
    try {
      let member = await Member.update(obj, {where: {id: obj.id}}, {transaction: t});
      member = await Member.findByPk(obj.id);
      await t.commit();
      return member;
    } catch (e) {
      console.log('\x1b[31m%s\x1b[0m', e);
      await t.rollback();
    }
  };
  
  exports.delete = async (obj) =>{
    const t = await sequelize.transaction();
    try {
      const member = await Member.destroy({where: {id: obj.id}}, {transaction: t});
      if (!member) {
        await t.rollback();
        return null;
      }
  
      await t.commit();
      return member;
    } catch (e) {
      console.log('\x1b[31m%s\x1b[0m', e);
    }
  };