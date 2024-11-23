const SettingGeneral = require("../../model/setting-genetal.model")

module.exports.settingGeneral=async(req,res,next) => {
    const settingGeneral = await SettingGeneral.findOne({})
    res.locals.settingGeneral = settingGeneral
    next()
}