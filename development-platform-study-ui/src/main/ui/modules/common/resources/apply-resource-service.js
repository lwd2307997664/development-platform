/**
 * Created by wuyf on 2014/7/30
 * 申报资源服务工厂对象-将申报资源的定义统一规范化，便于扩展
 * APPLY_RESOURCE 定义了后台资源的常量
 * ApplyResourceFactory 提供了获取资源对象的方法crtResource(applyResource)
 * --使用方法---------------------------------------------------------------------
 * 1.注入ApplyResourceFactory，APPLY_RESOURCE， 通过
 * .controller('MyCtrl', function ($scope, $log,ApplyResourceFactory,APPLY_RESOURCE) {
 *       //查询未提交申报
 *       $scope.test = function () {
 *       // 获取人员增员资源
 *          var rs = ApplyResourceFactory.crtResource(APPLY_RESOURCE.EmployedApply);
 *          rs.queryUnsubmitApply(4000000031998376);
 *       }
 *     ..省略其他代码
 * })
 *
 */
'use strict';
angular.module('hrss.si.enterprise.resourceModule')
//申报类型常量定义
    .constant('APPLY_TYPE', {
        BatchAttachmentUpload_Dimission: {
            value: '材料批量上传_1203',
            name: '职工减员材料批量上传_1203',
            detailUrl: '---',
            ctrlName: ''
        },
        NetComCancelApply: {
            value: '3101',
            name: '参保单位社会保险注销（一网通办）',
            detailUrl: 'modules/oneNet/unitchange/views/oneNetComCancelApplyView.html',
            ctrlName: ''
        },
        NetTreatDeathApply: {
            value: '3206',
            name: '退休人员待遇死亡核定(一网通办)',
            detailUrl: 'modules/oneNet/treatdeath/views/oneNetTreatDeathView.html',
            ctrlName: ''
        },
        NetCompanyModifyApply: {
            value: '3102',
            name: '单位信息修改申报(一网通办)',
            detailUrl: 'modules/oneNet/comModify/views/oneNetComBasicinfoModifyView.html',
            ctrlName: ''
        },
        NetCompanyRigisterApply: {
            value: '3103',
            name: '参保单位社会保险登记(一网通办)',
            detailUrl: 'modules/oneNet/comRegister/views/oneNetComRegisterView.html',
            ctrlName: ''
        },
        NetEmpModifyApply: {
            value: '3203',
            name: '在职职工信息修改(一网通办)',
            detailUrl: 'modules/oneNet/perModify/views/oneNetEmpModifyView.html',
            ctrlName: ''
        },
        NetEmpRetireModifyApply: {
            value: '3204',
            name: '离退休员工信息修改(一网通办)',
            detailUrl: 'modules/oneNet/retireModify/views/oneNetEmpRetireModifyView.html',
            ctrlName: ''
        },
        NetEmpRegisterApply: {
            value: '3205',
            name: '职工增员申报(一网通办)',
            detailUrl: 'modules/oneNet/perRegister/views/OneNetEmpRegisterView.html',
            ctrlName: ''
        },
        ResidentTransferApply: {
            value: '3207',
            name: '城镇职工基本养老保险与城乡居民基本养老保险制度衔接申请(一网通办)',
            detailUrl: 'modules/employee/transfer/views/residentTransferView.html',
            ctrlName: ''
        },
        TreatVerificationApply: {
            value: '1311',
            name: '机关事业单位养老保险人员待遇核定(一网通办)',
            detailUrl: 'modules/employee/treatverification/views/treatVerificationModule.html',
            ctrlName: ''
        },
        TreatVerificationFor110Apply: {
            value: '1312',
            name: '企业养老保险人员待遇核定(一网通办)',
            detailUrl: 'modules/employee/treatverificationfor110/views/treatVerificationFor110Module.html',
            ctrlName: ''
        },
        RepeatPensionApply: {
            value: '1313',
            name: '重复领取养老金结算申报',
            detailUrl: 'modules/company/apply/repeatpension/views/repeatPensionApplyModule.html',
            ctrlName: ''
        },
        EmpPayReturnApply: {
            value: '1214',
            name: '个人社会保险费退收(一网通办)',
            detailUrl: 'modules/employee/payreturn/views/payReturnView.html',
            ctrlName: ''
        },
        ComPostPonePayApply: {
            value: '1112',
            name: '单位社会保险费缓缴申报(一网通办)',
            detailUrl: 'modules/company/apply/postponepay/views/comPostPonePayApplyView.html',
            ctrlName: ''
        },


        EmpModifyApply: {
            value: '1201',
            name: '职工信息修改申报',
            detailUrl: 'modules/employee/modify/views/empModifyView.html',
            ctrlName: ''
        },
        EmpRegisterApply: {
            value: '1202',
            name: '职工增员申报',
            detailUrl: 'modules/employee/register/views/empRegisterHeadView.html',
            ctrlName: ''
        },
        EmpDimissionApply: {
            value: '1203',
            name: '职工减员申报',
            detailUrl: 'modules/employee/dimission/views/empDimissionView.html',
            ctrlName: ''
        },
        CompanyModifyApply: {
            value: '1101',
            name: '单位信息修改申报',
            detailUrl: 'modules/company/apply/modify/views/comBasicinfoModifyView.html',
            ctrlName: ''
        },
        InjuryRegisterApply: {
            value: '1109',
            name: '工伤登记',
            detailUrl: 'modules/company/modify/basicinfo/views/comBasicinfoModifyView.html',
            ctrlName: ''
        },
        ComSalaryApply: {
            value: '1102',
            name: '单位职工工资总额申报',
            detailUrl: 'modules/company/apply/salary/views/comSalaryApplyView.html'
        },
        EmpSalaryApply: {
            value: '1103',
            name: '单位职工工资收入申报',
            detailUrl: 'modules/company/apply/empsalary/views/empSalaryModule.html',
            ctrlName: ''
        },
        InsuranceModifyApply: {
            value: '1104',
            name: '单位险种变更申报',
            detailUrl: 'modules/company/apply/insurance/views/insuranceModifyView.html',
            ctrlName: ''
        },
        ComSocialMakingApply: {
            value: '1105',
            name: '社会保险登记证补证申报',
            detailUrl: 'modules/company/apply/unitchange/views/comSocialMakingView.html',
            ctrlName: ''
        },
        ComMergeApply: {
            value: '1106',
            name: '参保单位合并',
            detailUrl: 'modules/company/apply/unitchange/views/comMergeApplyView.html',
            ctrlName: ''
        },
        ComCancelApply: {
            value: '1107',
            name: '参保单位社会保险注销',
            detailUrl: 'modules/company/apply/unitchange/views/comCancelApplyView.html',
            ctrlName: ''
        },
        ComInfoCollectApply: {
            value: '1113',
            name: '单位征缴计划到账时间申报',
            detailUrl: 'modules/company/apply/cominfocollect/views/comInfoCollectApplyView.html',
            ctrlName: ''
        },
        EmpInfoCollectApply: {
            value: '1114',
            name: '原试点单位人员信息采集申报',
            detailUrl: 'modules/company/apply/empinfocollect/views/empInfoCollectView.html',
            ctrlName: ''
        },
        SteadySubsidiesApply: {
            value: '1115',
            name: '普通稳岗补贴申请',
            detailUrl: 'modules/company/apply/steadysubsidies/views/steadySubsidiesApplyView.html',
            ctrlName: ''
        },
        EmergencySubsidyApply: {
            value: '1116',
            name: '应急稳岗补贴申请',
            detailUrl: 'modules/company/apply/emergencysubsidy/views/emergencySubsidyApplyView.html',
            ctrlName: ''
        },
        EnterRecordApply: {
            value: '1117',
            name: '所属中小微企业备案',
            detailUrl: 'modules/company/apply/enterrecord/views/enterRecordModule.html',
            ctrlName: ''
        },
        ComDivideApply: {
            value: '1118',
            name: '中小微企业划型申报',
            detailUrl: 'modules/company/apply/comdivide/views/comDivideApplyModule.html',
            ctrlName: ''
        },
        PyamentBaseChangeApply: {
            value: '1205',
            name: '个人缴费基数变更申报',
            detailUrl: 'modules/company/apply/paymentbase/views/PaymentBaseChangeView.html',
            ctrlName: ''
        },
        TreatDimissionApply: {
            value: '1301',
            name: '养老保险待遇暂停申报',
            detailUrl: 'modules/employee/treatment/treatdimission/views/treatDimissionView.html',
            ctrlName: ''
        },
        TreatRenewalApply: {
            value: '1302',
            name: '养老保险待遇续发申报',
            detailUrl: 'modules/employee/treatment/treatRenewal/views/treatRenewalView.html',
            ctrlName: ''
        },
        SupportDimissionApply: {
            value: '1303',
            name: '供养亲属待遇暂停申报',
            detailUrl: 'modules/employee/treatment/supportdimission/views/supportDimissionView.html',
            ctrlName: ''
        },
        SupportRenewalApply: {
            value: '1304',
            name: '供养亲属待遇续发申报',
            detailUrl: 'modules/employee/treatment/supportRenewal/views/supportRenewalView.html',
            ctrlName: ''
        },
        SupportModifyInfoApply: {
            value: '1305',
            name: '供养亲属基本信息变更',
            detailUrl: 'modules/employee/treatment/supportmodifyinfo/views/supportModifyInfoView.html',
            ctrlName: ''
        },
        SupportBankUseApply: {
            value: '1306',
            name: '供养亲属待遇发放信息维护',
            detailUrl: 'modules/employee/treatment/supportbank/views/supportBankUseView.html',
            ctrlName: ''
        },
        PayCollectionApply: {
            value: '1207',
            name: '个人社保缴费补收申报',
            detailUrl: 'modules/employee/paycollection/views/payCollectionView.html',
            ctrlName: ''
        },
        PaybackApply: {
            value: '1208',
            name: '个人社会保险费补缴申报',
            detailUrl: 'modules/employee/payback/views/paybackView.html',
            ctrlName: ''
        },
        EmpRetireApply: {
            value: '1401',
            name: '退休申报',
            detailUrl: 'modules/employee/retire/views/empRetireView.html',
            ctrlName: ''
        },
        EmpRetireModifyApply: {
            value: '1402',
            name: '离退休职工信息修改申报',
            detailUrl: 'modules/employee/retiremodify/views/empRetireModifyView.html',
            ctrlName: ''
        },
        MedicalTransferApply: {
            value: '1501',
            name: '医疗保险转移联系函申报',
            detailUrl: 'modules/employee/transfer/views/medicalTransferView.html',
            ctrlName: ''
        },
        RepeatReturnApply: {
            value: '1314',
            name: '重复领取养老金退款申报',
            detailUrl: 'modules/employee/repeatreturn/views/repeatReturnView.html',
            ctrlName: ''
        },

        PensionFor120TransferApply: {
            value: '1502',
            name: '机关养老保险转移联系函申报',
            detailUrl: 'modules/employee/transfer/views/pensionFor120TransferView.html',
            ctrlName: ''
        },
        PensionFor110TransferApply: {
            value: '1503',
            name: '企业养老保险转移联系函申报',
            detailUrl: 'modules/employee/transfer/views/pensionFor110TransferView.html',
            ctrlName: ''
        },
        OccupationTransferApply: {
            value: '1504',
            name: '职业年金转移联系函申报',
            detailUrl: 'modules/employee/transfer/views/occupationTransferView.html',
            ctrlName: ''
        },
        ApprovingConfirmApply: {
            value: '1211',
            name: '职工缴费基数核定确认',
            detailUrl: 'modules/employee/base/approvingconfirm/views/approvingConfirmView.html',
            ctrlName: ''
        },
        SpecialModifyApply: {
            value: '1210',
            name: '人员特殊信息修改',
            detailUrl: 'modules/employee/special/views/specialModifyView.html',
            ctrlName: ''
        },
        BankUseApply: {
            value: '1209',
            name: '发放信息维护',
            detailUrl: 'modules/employee/bank/views/bankUseView.html',
            ctrlName: ''
        },
        InjureRegisterApply: {
            value: '2241',
            name: '工伤登记',
            detailUrl: 'modules/injure/register/views/injuryRegisterView.html',
            ctrlName: ''
        },
        InjureModifyApply: {
            value: '2242',
            name: '工伤信息变更',
            detailUrl: 'modules/injure/modify/views/injuryModifyView.html',
            ctrlName: ''
        },
        InjureDeathRegisterApply: {
            value: '2243',
            name: '工亡信息登记',
            detailUrl: 'modules/injure/death/views/injuryDeathRegisterView.html',
            ctrlName: ''
        },
        InjureSupportModifyApply: {
            value: '2244',
            name: '工伤供养亲属信息变更',
            detailUrl: 'modules/injure/relative/views/injurySupportModifyView.html',
            ctrlName: ''
        },
        InjureTreatRenewalApply: {
            value: '2245',
            name: '工伤定期待遇续发申报',
            detailUrl: 'modules/injure/treatrenewal/views/injuryTreatRenewalView.html',
            ctrlName: ''
        },
        InjureMedicalAprovalApply: {
            value: '2246',
            name: '小工伤医疗费用核定申报',
            detailUrl: 'modules/injure/medicalaproval/views/injuryMedicalAprovalView.html',
            ctrlName: ''
        },
        InjureElsewhereApply: {
            value: '2247',
            name: '工伤职工异地居住就医申请',
            detailUrl: 'modules/injure/elsewhere/views/injuryElsewhereView.html',
            ctrlName: ''
        },
        PayAccountApply: {
            value: '2248',
            name: '工伤先行支付信息登记',
            detailUrl: 'modules/injure/payaccount/views/payAccountModule.html',
            ctrlName: ''
        },
        PersonnelAllotmentApply: {
            value: '0000',
            name: '人员分配批量',
            detailUrl: 'modules/manage/groupPersonManage/views/groupPersonView.html',
            ctrlName: ''
        },
        PersonInternalTransferApply: {
          value: '0001',
          name: '人员调动',
          detailUrl: 'modules/manage/groupPersonManage/views/groupPersonView.html',
          ctrlName: ''
        },
        EmpPlaceApply: {
            value: '1110',
            name: '就业安置补助申请',
            detailUrl: 'modules/company/apply/empplace/views/empPlaceView.html',
            ctrlName: ''
        },
        OrganRetireApply: {
            value: '1403',
            name: '机关事业单位正式待遇申领',
            detailUrl: 'modules/employee/organretire/views/organRetireView.html',
            ctrlName: ''
        },
        TempRetireApply: {
            value: '1404',
            name: '机关事业单位临时待遇申领',
            detailUrl: 'modules/employee/tempretire/views/tempRetireView.html',
            ctrlName: ''
        },
        PlanTransferApply: {
            value: '1111',
            name: '统筹范围内转移申报',
            detailUrl: 'modules/company/apply/plantransfer/views/planTransferView.html',
            ctrlName: ''
        },
        RetireRecordApply: {
            value: '1405',
            name: '退休人员补录',
            detailUrl: 'modules/employee/retirerecord/views/retireRecordView.html',
            ctrlName: ''
        },
        OnJobEmpCollectApply: {
            value: '1212',
            name: '在职人员信息采集',
            detailUrl: 'modules/employee/onjobempcollect/views/onJobEmpCollectView.html',
            ctrlName: ''
        },
        RetireCollectApply: {
            value: '1213',
            name: '退休人员信息采集',
            detailUrl: 'modules/employee/retirecollect/views/retireCollectView.html',
            ctrlName: ''
        },
        RetireDeathFor110Apply: {
            value: '1406',
            name: '企业退休死亡',
            detailUrl: 'modules/employee/death110/views/retireDeathFor110View.html',
            ctrlName: ''
        },
        RetireDeathFor120Apply: {
            value: '1407',
            name: '机关退休死亡',
            detailUrl: 'modules/employee/death120/views/retireDeathFor120View.html',
            ctrlName: ''
        },
        RetireTreatChangeApply: {
            value: '1408',
            name: '离退休干部护理费调整',
            detailUrl: 'modules/employee/retiretreatchange/views/retireTreatChangeView.html',
            ctrlName: ''
        },
        SupportEndApply: {
            value: '1309',
            name: '供养亲属待遇终止',
            detailUrl: 'modules/employee/treatment/supportend/views/supportEndView.html',
            ctrlName: ''
        },
        MilitarySubsidyApply: {
            value: '1307',
            name: '军转干补贴企业申报',
            detailUrl: 'modules/employee/militarysubsidy/views/militarySubsidyView.html',
            ctrlName: ''
        },
        TeacherSubsidyApply: {
            value: '1308',
            name: '职教幼教补贴企业申报',
            detailUrl: 'modules/employee/teachersubsidy/views/teacherSubsidyView.html',
            ctrlName: ''
        },
        PersionHandInApply: {
            value: '1310',
            name: '养老转入信息手工录入申报',
            detailUrl: 'modules/employee/pensionhandIn/views/pensionHandInView.html',
            ctrlName: ''
        },
        PersionAdjustChangeApply: {
            value: '1215',
            name: '退休人员养老金调整申报',
            detailUrl: 'modules/employee/persionadjust/views/persionAdjustChangeApplyView.html',
            ctrlName: ''
        },
        EmpOnWorkApply: {
            value: '1216',
            name: '机关养老在职人员信息采集申报',
            detailUrl: 'modules/employee/orgonwork/views/orgOnWorkView.html',
            ctrlName: ''
        },
        SkillUpgradeApply: {
            value: '1217',
            name: '职业技能提升补贴预申报',
            detailUrl: 'modules/employee/skill/views/skillUpgradeView.html',
            ctrlName: ''
        },
        UnempApply: {
            value: '1218',
            name: '失业保险待遇申领申报',
            detailUrl: 'modules/employee/unemployment/views/UnemploymentApplyView.html',
            ctrlName: ''
        }
    })


    //申报资源常量定义
    .constant('APPLY_RESOURCE', {
        BatchAttachmentUpload: {url: '/api/batch/attachment', name: '材料批量上传'},
        EmpModifyApply: {url: '/api/apply/employee/modifyApply', name: '职工信息修改申报'},
        EmpRetireModifyApply: {url: '/api/apply/employee/retiremodify', name: '离退休职工信息修改申报'},
        EmpRegisterApply: {url: '/api/apply/employee/registerApply', name: '职工增员申报'},
        EmpDimissionApply: {url: '/api/applys/employee/dimissionApply', name: '职工减员申报'},
        EmpSalaryApply: {url: '/api/apply/company/empsalaryApply', name: '单位职工个人工资收入申报'},
        InjuryRegisterApply: {url: '/api/apply/injury/registerApply', name: '工伤登记申报'},
        ComSalaryApply: {url: '/api/apply/company/salary', name: '单位职工工资总额申报'},
        CompanyModifyApply: {url: '/api/apply/company/modifyApply', name: '单位基本信息修改'},
        InsuranceModifyApply: {url: '/api/apply/company/insureApply', name: '单位险种变更申报'},
        PyamentBaseChangeApply: {url: '/api/apply/paymentbase/change', name: '个人缴费基数变更'},
        ComSocialMakingApply: {url: '/api/apply/company/socialmaking', name: '社会保险登记证补证申报'},
        ComMergeApply: {url: '/api/apply/company/commerge', name: '单位合并申报'},
        ComCancelApply: {url: '/api/apply/company/comcancel', name: '参保单位社会保险注销'},
        TreatDimissionApply: {url: '/api/applys/employee/treatment/dimission', name: '养老保险待遇暂停申报'},
        SupportDimissionApply: {url: '/api/applys/employee/support/dimission', name: '供养亲属待遇暂停申报'},
        TreatRenewalApply: {url: '/api/applys/employee/treatment/renewal', name: '养老保险待遇续发申报'},
        SupportRenewalApply: {url: '/api/applys/employee/treatment/supportrenewal', name: '供养亲属待遇续发申报'},
        SupportModifyInfoApply: {url: '/api/applys/employee/support/modifyInfo', name: '供养亲属基本信息变更申报'},
        SupportBankUseApply: {url: '/api/applys/employee/support/bank', name: '供养亲属待遇发放信息维护'},
        PayCollectionApply: {url: '/api/applys/employee/paycollection', name: '个人社保缴费补收申报'},
        PaybackApply: {url: '/api/apply/employee/paybackApply', name: '个人社会保险费补缴申报'},
        EmpRetireApply: {url: '/api/applys/employee/retire', name: '退休申报'},
        MedicalTransferApply: {url: '/api/applys/employee/medical', name: '医疗保险转移联系函申报'},
        RepeatReturnApply: {url: '/api/applys/employee/repeatreturn', name: '重复领取养老金退款申报'},
        PensionFor120TransferApply: {url: '/api/applys/employee/pensionFor120', name: '机关养老保险转移联系函申报'},
        PensionFor110TransferApply: {url: '/api/applys/employee/pensionFor110', name: '企业养老保险转移联系函申报'},
        OccupationTransferApply: {url: '/api/applys/employee/occupation', name: '职业年金转移联系函申报'},
        ResidentTransferApply: {url: '/api/applys/employee/transfer/resident', name: '城镇职工基本养老保险与城乡居民基本养老保险制度衔接申请(一网通办)'},
        ApprovingConfirmApply: {url: '/api/applys/employee/approvingconfirm', name: '职工缴费基数核定确认'},
        SpecialModifyApply: {url: '/api/apply/employee/specialModify', name: '人员特殊信息修改'},
        BankUseApply: {url: '/api/applys/employee/empBankUseApply', name: '发放信息维护'},
        InjureRegisterApply: {url: '/api/apply/injure/registerApply', name: '工伤登记'},
        InjureModifyApply: {url: '/api/apply/injure/modifyApply', name: '工伤信息变更'},
        InjureDeathRegisterApply: {url: '/api/apply/injure/deathregisterApply', name: '工亡信息登记'},
        InjureSupportModifyApply: {url: '/api/apply/injure/supportModifyApply', name: '工伤供养亲属信息变更'},
        InjureTreatRenewalApply: {url: '/api/apply/injure/treatRenewalApply', name: '工伤定期待遇续发申报'},
        InjureMedicalAprovalApply: {url: '/api/apply/injure/medicalAprovalApply', name: '小工伤医疗费用核定申报'},
        InjureElsewhereApply: {url: '/api/apply/injure/elsewhereApply', name: '工伤职工异地居住就医申请'},
        PayAccountApply: {url: '/api/apply/injure/payAccountApply', name: '工伤先行支付信息登记'},
        NetEmpModifyApply: {url: '/api/apply/employee/oneNetModifyApply', name: '在职职工信息修改(一网通办)'},
        NetEmpRetireModifyApply: {url: '/api/apply/employee/oneNetRetiremodify', name: '离退休员工信息修改(一网通办)'},
        NetEmpRegisterApply: {url: '/api/apply/employee/oneNetRegisterApply', name: '职工增员申报(一网通办)'},
        NetTreatDeathApply: {url: '/api/applys/employee/oneNetTreatDeathApply', name: '退休人员待遇死亡核定申报(一网通办)'},
        NetComCancelApply: {url: '/api/apply/company/oneNetComcancel', name: '参保单位社会保险注销(一网通办)'},
        NetCompanyModifyApply: {url: '/api/apply/company/oneNetComModifyApply', name: '单位信息修改申报(一网通办)'},
        NetCompanyRigisterApply: {url: '/api/public/apply/company/register', name: '参保单位社会保险登记(一网通办)'},
        TreatVerificationApply: {url: '/api/applys/employee/treatverification', name: '机关事业单位养老保险人员待遇核定(一网通办)'},
        TreatVerificationFor110Apply: {url: '/api/applys/employee/treatverificationfor110', name: '机关事业单位养老保险人员待遇核定(一网通办)'},
        EmpPayReturnApply: {url: '/api/applys/employee/payreturn', name: '个人社会保险费退收(一网通办)'},
        ComPostPonePayApply: {url: '/api/applys/combasic/postponepay', name: '单位社会保险费缓缴申报(一网通办)'},
        ComInfoCollectApply: {url: '/api/applys/combasic/comInfoCollect', name: '单位征缴计划到账时间申报)'},
        EmpInfoCollectApply: {url: '/api/applys/combasic/empInfoCollect', name: '原试点单位人员信息采集申报)'},
        SteadySubsidiesApply: {url: '/api/apply/company/steady', name: '普通稳岗补贴申请'},
        RepeatPensionApply: {url: '/api/apply/company/repeat', name: '重复领取养老金结算'},
        EmergencySubsidyApply: {url: '/api/apply/company/emergency', name: '应急稳岗补贴'},
        PersonnelAllotmentApply: {url: '/api/manage/person/internal', name: '人员分配批量'},
        PersonInternalTransferApply: {url: '/api/manage/person/internalTransfer', name: '人员分配批量'},
        EmpPlaceApply: {url: '/api/apply/company/empPlace', name: '就业安置补助申请'},
        OrganRetireApply: {url: '/api/apply/employee/orgRetire', name: '机关事业单位正式待遇申领'},
        TempRetireApply: {url: '/api/apply/employee/tempRetire', name: '机关事业单位临时待遇申领'},
        PlanTransferApply: {url: '/api/apply/employee/planTransferApply', name: '统筹范围内转移申报'},
        RetireRecordApply: {url: '/api/apply/employee/recordApply', name: '退休人员补录'},
        OnJobEmpCollectApply:{url: '/api/apply/employee/onJobCollect', name: '在职人员信息采集'},
        RetireCollectApply:{url: '/api/apply/employee/retireCollect', name: '退休人员信息采集'},
        RetireDeathFor110Apply:{url: '/api/apply/employee/deathfor110', name: '企业退休死亡'},
        RetireDeathFor120Apply:{url: '/api/apply/employee/deathfor120', name: '机关退休死亡'},
        RetireTreatChangeApply:{url: '/api/applys/employee/retiretreatchange', name: '离退休干部护理费调整'},
        SupportEndApply: {url: '/api/applys/employee/support/end', name: '供养亲属待遇终止申报'},
        MilitarySubsidyApply: {url: '/api/apply/employee/military', name: '军转干补贴企业申报'},
        TeacherSubsidyApply: {url: '/api/apply/employee/teacher', name: '职教幼教补贴企业申报'},
        PersionHandInApply: {url: '/api/apply/employee/pensionHandInApply', name: '养老转移信息手工录入申报'},
        PersionAdjustChangeApply: {url: '/api/applys/employee/persionadjustchangeapply', name: '退休人员养老金调整申报'},
        EmpOnWorkApply: {url: '/api/apply/employee/emponworkapply', name: '机关养老在职人员信息采集申报'},
        SkillUpgradeApply: {url: '/api/applys/employee/skill', name: '职业技能提升补贴预申报'},
        UnempApply:{url: '/api/applys/employee/unemployment', name: '失业保险待遇申领申报'},
        EnterRecordApply:{url: '/api/apply/company/enterrecord', name: '所属中小微企业备案'},
        ComDivideApply: {url: '/api/apply/company/divide', name: '中小微企业划型申报'}
    })
    //申报业务应用事件定义
    .constant('APPLY_APP_EVENT', {
        createNewApply: 'APPLY_CREATE',  //创建申报完成事件
        modifyApply: 'APPLY_MODIFY',     //修改申报事件
        modifyApplyComplete: 'APPLY_MODIFY_COMPLETE',     //修改申报完成事件
        fileUploadComplete: 'APPLY_FILE_UPLOAD',//上传报盘完成事件
        fileUploadSessionFinish: 'APPLY_FILE_SESSION_FINISH',//报盘处理完成事件
        initApply: 'INIT_APPLY',//初始化事件
    })
    //申报资源工厂
    .factory('ApplyResourceFactory', ['$resource', 'girderConfig', '$log', function ($resource, appConfig, $log) {

        var factory = {};

        /**
         * 获取申报resource url
         * @param applyResource
         * @returns {string}
         */
        function buildBaseUrl(applyResource) {
            var url = applyResource.url;
            return appConfig.baseUrl + url + '/:id';
        }

        /**
         * 获取提交 url
         * @param applyResource
         * @returns {string}
         */
        function buildSubmitUrl(applyResource) {
            var url = applyResource.url;
            return appConfig.baseUrl + url + '/submission' + '/:id';
        }
        /**
         * 获取撤销 url
         * @param applyResource
         * @returns {string}
         */
        function buildCancelUrl(applyResource) {
            var url = applyResource.url;
            return appConfig.baseUrl + url + '/cancelApply' + '/:id';
        }
        /**
         * 获取重新申报 url
         * @param applyResource
         * @returns {string}
         */
        function buildResubmitlUrl(applyResource) {
            var url = applyResource.url;
            return appConfig.baseUrl + url + '/resubmitApply' + '/:id';
        }

        /**
         * 获取提交 url
         * @param applyResource
         * @returns {string}
         */
        function buildSubmitUrlForValidate(applyResource) {
            var url = applyResource.url;
            return appConfig.baseUrl + '/api/apply/stats/reviewing';
        }

        /**
         * 获取审核 url
         * @param applyResource
         * @returns {string}
         */
        function buildAgentUrl(applyResource) {
            var url = applyResource.url;
            return appConfig.baseUrl + url + '/agent' + '/:id';
        }

        /**
         * 获取批量删除URL
         * @param applyResource
         * @returns {string}
         */
        function buildBatchDeleteUnSubmitApplyURL(applyResource) {
            var url = applyResource.url;
            return appConfig.baseUrl + url + '/batchDelete' + '/:id';
        }

        /**
         * 获取重新提交 url
         * @param applyResource
         * @returns {string}
         */
        function buildResubmitUrl(applyResource) {
            var url = applyResource.url;
            return appConfig.baseUrl + url + '/resubmission/:id';
        }

        /**
         * 文件上传Session查询处理 url
         * @param applyResource
         * @returns {string}
         */
        function buildUploadSessionListUrl(applyResource) {
            var url = applyResource.url;
            return appConfig.baseUrl + url + '/upload/uploadSessions';
        }

        /**
         * 文件上传处理结果查询 url
         * @param applyResource
         * @returns {string}
         */
        function buildUploadResultUrl(applyResource) {
            var url = applyResource.url;
            return appConfig.baseUrl + url + '/upload/uploadSessions/:sessionId/result';
        }

        /**
         * 刷新某个处理结果 url
         * @param applyResource
         * @returns {string}
         */
        function buildQueryUploadFileSessionUrl(applyResource) {
            var url = applyResource.url;
            return appConfig.baseUrl + url + '/upload/uploadSessions/:sessionId';
        }

        /**
         * 删除某个处理结果 url
         * @param applyResource
         * @returns {string}
         */
        function buildDeleteUploadFileSessionUrl(applyResource) {
            var url = applyResource.url;
            return appConfig.baseUrl + url + '/upload/uploadSessions/:sessionId';
        }

        /**
         * 业务类校验申报 url
         * @param applyResource
         * @returns {string}
         */
        function buildCheckBusinessApplyUrl(applyResource) {
            var url = applyResource.url;
            return appConfig.baseUrl + url + '/check/:id';
        }

        /**
         * 业务类查询申报 url
         * @param applyResource
         * @returns {string}
         */
        function buildQueryBusinessApplyUrl(applyResource) {
            var url = applyResource.url;
            return appConfig.baseUrl + url + '/info';
        }

        /**
         * 获取待审核申报
         * @param applyResource
         * @returns {string}
         */
        function buildAgentApplyURL(applyResource) {
            var url = applyResource.url;
            return appConfig.baseUrl + url + '/agentList';
        }

        /**
         * 获取待提交申报
         * @param applyResource
         * @returns {string}
         */
        function buildHistoryApplyURL(applyResource) {
            var url = applyResource.url;
            return appConfig.baseUrl + url + '/history';
        }

        /**
         * 构建申报Resource对象
         * @param applyResource  APPLY_RESOURCE 常量
         * @returns {*}
         */
        function buildResource(applyResource) {
            $log.log('传入resource常量', applyResource);
            var url = buildBaseUrl(applyResource);
            $log.log('构建resource路径', url);
            var rs = $resource(url, {id: '@id'},
                {
                    //批量删除申报
                    batchDeleteUnSubmitApply: {method: 'POST', url: buildBatchDeleteUnSubmitApplyURL(applyResource)},
                    //查询未提交申报业务
                    listOperatableApply: {method: 'GET', param: {companyId: '@companyId'}, isArray: true},
                    //查询未提交申报业务
                    historyApply: {
                        method: 'GET',
                        url: buildHistoryApplyURL(applyResource),
                        param: {companyId: '@companyId', applicantId: '@applicantId'},
                        isArray: true
                    },
                    //查询待审核申报业务
                    listAgentApply: {
                        method: 'GET',
                        url: buildAgentApplyURL(applyResource),
                        param: {companyNumber: '@companyNumber'},
                        isArray: true
                    },
                    //更新未提交申报信息
                    update: {method: 'PUT'},
                    //提交申报
                    submitApply: {method: 'PUT', url: buildSubmitUrl(applyResource)},
                    //撤销申报
                    cancelApply: {method: 'PUT', url: buildCancelUrl(applyResource)},
                   //撤销申报
                    resubmitApply: {method: 'PUT', url: buildResubmitlUrl(applyResource)},
                    //审核申报
                    agentApply: {method: 'PUT', url: buildAgentUrl(applyResource)},
                    //重新提交
                    fnResubmitApply: {method: 'POST', url: buildResubmitUrl(applyResource)},
                    //查询已经提交的申报
                    listSubmitedApply: {
                        method: 'GET', param: {
                            applicantId: '@applicantId',
                            issue: 0, reviewedStatus: '0'
                        }, url: buildSubmitUrl(applyResource), isArray: true
                    },
                    //查询已经提交的申报
                    getSubmitedApply: {
                        method: 'POST',
                        url: buildSubmitUrlForValidate(applyResource),
                        isArray: true
                    },
                    //文件上传Session查询处理
                    listUploadSessions: {
                        method: 'Get',
                        param: {companyId: '@companyId', applyType: applyResource.applyType},
                        url: buildUploadSessionListUrl(applyResource),
                        isArray: true
                    },
                    //文件上传处理结果查询
                    queryUploadResult: {method: 'Get', url: buildUploadResultUrl(applyResource)},
                    //刷新某条处理结果
                    queryUploadFileSession: {method: 'Get', url: buildQueryUploadFileSessionUrl(applyResource)},
                    //删除某条处理结果
                    deleteUploadFileSession: {method: 'DELETE', url: buildDeleteUploadFileSessionUrl(applyResource)},
                    //业务类校验申报
                    checkBusinessApply: {method: 'POST', url: buildCheckBusinessApplyUrl(applyResource)},
                    //业务类查询申报
                    queryBusinessApply: {method: 'POST', url: buildQueryBusinessApplyUrl(applyResource)},
                });
            /**
             * 查询未提交申报业务清单
             * @param applicantId
             * @returns {*}
             */
            rs.queryUnsubmitApply = function (applicantId) {
                return rs.listOperatableApply({companyId: applicantId}, function (data) {
                    return data;
                });
            };
            /**
             * 查询未提交申报业务清单
             * @param applicantId
             * @returns {*}
             */
            rs.queryHistoryApply = function (companyId, applicantId) {
                return rs.historyApply({companyId: companyId, applicantId: applicantId}, function (data) {
                    return data;
                });
            };
            /**
             * 查询待审核申报业务清单
             * @param applicantId
             * @returns {*}
             */
            rs.queryAgentApply = function (companyId) {
                return rs.listAgentApply({companyId: companyId}, function (data) {
                    return data;
                });
            };
            /**
             * 重新提交申请
             * @param applyId
             */
            rs.resubmitApply = function (applyId) {
                return rs.fnResubmitApply({id: applyId});
            };

            /**
             * 查询已经提交申报业务清单
             * @param applicantId 申请者Id
             * @param issue       结算期
             * @param reviewedStatus 申报状态
             * @returns {*}
             */
            rs.querySubmitedApply = function (applicantId, issue, reviewedStatus, submitType) {
                return rs.listSubmitedApply({
                        applicantId: applicantId,
                        issue: issue,
                        reviewedStatus: reviewedStatus,
                        submitType: submitType
                    },
                    function (data) {
                        return data;
                    });
            };

            /**
             * 查询已经提交申报业务清单
             * @param applicantId 申请者Id
             * @param issue       结算期
             * @param reviewedStatus 申报状态
             * @returns {*}
             */
            rs.querySubmitedApply = function (applicantId, issue, reviewedStatus, submitType,beginDate,endDate) {
                return rs.listSubmitedApply({
                        applicantId: applicantId,
                        issue: issue,
                        reviewedStatus: reviewedStatus,
                        submitType: submitType,
                        beginDate:beginDate,
                        endDate:endDate
                    },
                    function (data) {
                        return data;
                    });
            };

            /**
             *获取正在审核中的数据
             * @param applicantId
             * @returns {*}
             */
            rs.querySubmitApply = function (detail) {
                return rs.getSubmitedApply(detail, function (data) {
                    return data;
                });
            };
            /**
             * 按申报Id获取申报
             * @param applyId
             * @returns {*}
             */
            rs.getApplyById = function (applyId) {
                return rs.get({id: applyId});
            };

            /**
             * 文件上传Session查询处理
             * @param companyId
             * @param applyType
             * @returns {*}
             */
            rs.queryApplyFileUploadList = function (companyId, applyType) {
                return rs.listUploadSessions({companyId: companyId, applyType: applyType},
                    function (data) {
                        return data;
                    });
            };

            /**
             * 文件上传session处理结果查询
             * @param sessionId
             * @returns {*}
             */
            rs.queryUploadFileResult = function (sessionId) {
                return rs.queryUploadResult({sessionId: sessionId},
                    function (data) {
                        return data;
                    });
            };

            /**
             * 刷新某条处理结果
             * @param sessionId
             * @returns {*}
             */
            rs.queryUploadSession = function (sessionId) {
                return rs.queryUploadFileSession({sessionId: sessionId},
                    function (data) {
                        return data;
                    });
            };
            /**
             * 删除某条处理结果
             * @param sessionId
             * @returns {*}
             */
            rs.deleteUploadSession = function (sessionId) {
                return rs.deleteUploadFileSession({sessionId: sessionId},
                    function (data) {
                        return data;
                    });
            };

            /**
             * 获取文件上传地址
             */
            rs.getUploadUrl = function () {
                return appConfig.baseUrl + applyResource.url + '/upload';
            };

            /**
             * 判断是否是新增对象
             * @returns {boolean}
             */
            rs.prototype.isNew = function () {
                return (typeof(this.applyId) === 'undefined' || this.applyId == null);
            };

            return rs;
        }

        //获取申报资源对象
        factory.crtResource = function (applyResource) {
            return buildResource(applyResource);
        };

        return factory;
    }])
    //根据业务类型APPLY_TYPE获取业务资源的分发对象
    .factory('ApplyTypeResourceResolvor', ['$log', 'APPLY_TYPE', 'APPLY_RESOURCE', 'ApplyResourceFactory', 'BusinessApplyConfig',
        function ($log, APPLY_TYPE, APPLY_RESOURCE, ApplyResourceFactory, BusinessApplyConfig) {
            var factory = {};
            var applyResource = null;
            //根据业务类型获取业务资源对象
            var dispathService = function (applyType) {
                $log.log('动态获取业务资源', applyType);
                switch (applyType) {
                    //单位信息修改
                    case APPLY_TYPE.CompanyModifyApply.value:
                        applyResource = APPLY_RESOURCE.CompanyModifyApply;
                        break;
                    //职工增员
                    case APPLY_TYPE.EmpRegisterApply.value:
                        applyResource = APPLY_RESOURCE.EmpRegisterApply;
                        break;
                    //职工基本信息修改
                    case APPLY_TYPE.EmpModifyApply.value:
                        applyResource = APPLY_RESOURCE.EmpModifyApply;
                        break;
                    //职工减员
                    case APPLY_TYPE.EmpDimissionApply.value:
                        applyResource = APPLY_RESOURCE.EmpDimissionApply;
                        break;
                    //离退休修改
                    case APPLY_TYPE.EmpRetireModifyApply.value:
                        applyResource = APPLY_RESOURCE.EmpRetireModifyApply;
                        break;
                    //职工年度工资申报
                    case APPLY_TYPE.EmpSalaryApply.value:
                        applyResource = APPLY_RESOURCE.EmpSalaryApply;
                        break;
                    //职工年度工资申报
                    case APPLY_TYPE.InjuryRegisterApply.value:
                        applyResource = APPLY_RESOURCE.InjuryRegisterApply;
                        break;
                    //单位工资总额
                    case APPLY_TYPE.ComSalaryApply.value:
                        applyResource = APPLY_RESOURCE.ComSalaryApply;
                        break;
                    case APPLY_TYPE.InsuranceModifyApply.value:
                        applyResource = APPLY_RESOURCE.InsuranceModifyApply;
                        break;
                    case APPLY_TYPE.PyamentBaseChangeApply.value:
                        applyResource = APPLY_RESOURCE.PyamentBaseChangeApply;
                        break;

                    case APPLY_TYPE.ComSocialMakingApply.value:
                        applyResource = APPLY_RESOURCE.ComSocialMakingApply;
                        break;
                    case APPLY_TYPE.ComMergeApply.value:
                        applyResource = APPLY_RESOURCE.ComMergeApply;
                        break;
                    case APPLY_TYPE.ComCancelApply.value:
                        applyResource = APPLY_RESOURCE.ComCancelApply;
                        break;
                    case APPLY_TYPE.TreatDimissionApply.value:
                        applyResource = APPLY_RESOURCE.TreatDimissionApply;
                        break;
                    case APPLY_TYPE.TreatRenewalApply.value:
                        applyResource = APPLY_RESOURCE.TreatRenewalApply;
                        break;
                    case APPLY_TYPE.SupportDimissionApply.value:
                        applyResource = APPLY_RESOURCE.SupportDimissionApply;
                        break;
                    case APPLY_TYPE.SupportRenewalApply.value:
                        applyResource = APPLY_RESOURCE.SupportRenewalApply;
                        break;
                    case APPLY_TYPE.SupportModifyInfoApply.value:
                        applyResource = APPLY_RESOURCE.SupportModifyInfoApply;
                        break;
                    case APPLY_TYPE.SupportBankUseApply.value:
                        applyResource = APPLY_RESOURCE.SupportBankUseApply;
                        break;
                    case APPLY_TYPE.PayCollectionApply.value:
                        applyResource = APPLY_RESOURCE.PayCollectionApply;
                        break;
                    case APPLY_TYPE.PaybackApply.value:
                        applyResource = APPLY_RESOURCE.PaybackApply;
                        break;
                    case APPLY_TYPE.MedicalTransferApply.value:
                        applyResource = APPLY_RESOURCE.MedicalTransferApply;
                        break;
                    case APPLY_TYPE.RepeatReturnApply.value:
                        applyResource = APPLY_RESOURCE.RepeatReturnApply;
                        break;
                    case APPLY_TYPE.PensionFor120TransferApply.value:
                        applyResource = APPLY_RESOURCE.PensionFor120TransferApply;
                        break;
                    case APPLY_TYPE.PensionFor110TransferApply.value:
                        applyResource = APPLY_RESOURCE.PensionFor110TransferApply;
                        break;
                    case APPLY_TYPE.OccupationTransferApply.value:
                        applyResource = APPLY_RESOURCE.OccupationTransferApply;
                        break;
                    case APPLY_TYPE.ApprovingConfirmApply.value:
                        applyResource = APPLY_RESOURCE.ApprovingConfirmApply;
                        break;
                    case APPLY_TYPE.EmpRetireApply.value:
                        applyResource = APPLY_RESOURCE.EmpRetireApply;
                        break;
                    case APPLY_TYPE.SpecialModifyApply.value:
                        applyResource = APPLY_RESOURCE.SpecialModifyApply;
                        break;
                    case APPLY_TYPE.BankUseApply.value:
                        applyResource = APPLY_RESOURCE.BankUseApply;
                        break;
                    case APPLY_TYPE.InjureRegisterApply.value:
                        applyResource = APPLY_RESOURCE.InjureRegisterApply;
                        break;
                    case APPLY_TYPE.InjureModifyApply.value:
                        applyResource = APPLY_RESOURCE.InjureModifyApply;
                        break;
                    case APPLY_TYPE.InjureDeathRegisterApply.value:
                        applyResource = APPLY_RESOURCE.InjureDeathRegisterApply;
                        break;
                    case APPLY_TYPE.InjureSupportModifyApply.value:
                        applyResource = APPLY_RESOURCE.InjureSupportModifyApply;
                        break;
                    case APPLY_TYPE.InjureTreatRenewalApply.value:
                        applyResource = APPLY_RESOURCE.InjureTreatRenewalApply;
                        break;
                    case APPLY_TYPE.InjureMedicalAprovalApply.value:
                        applyResource = APPLY_RESOURCE.InjureMedicalAprovalApply;
                        break;
                    case APPLY_TYPE.InjureElsewhereApply.value:
                        applyResource = APPLY_RESOURCE.InjureElsewhereApply;
                        break;
                    case APPLY_TYPE.PayAccountApply.value:
                        applyResource = APPLY_RESOURCE.PayAccountApply;
                        break;

                    case APPLY_TYPE.NetCompanyModifyApply.value:
                        applyResource = APPLY_RESOURCE.NetCompanyModifyApply;
                        break;
                    case APPLY_TYPE.NetCompanyRigisterApply.value:
                        applyResource = APPLY_RESOURCE.NetCompanyRigisterApply;
                        break;
                    case APPLY_TYPE.NetEmpModifyApply.value:
                        applyResource = APPLY_RESOURCE.NetEmpModifyApply;
                        break;
                    case APPLY_TYPE.NetEmpRetireModifyApply.value:
                        applyResource = APPLY_RESOURCE.NetEmpRetireModifyApply;
                        break;
                    case APPLY_TYPE.NetEmpRegisterApply.value:
                        applyResource = APPLY_RESOURCE.NetEmpRegisterApply;
                        break;
                    case APPLY_TYPE.ResidentTransferApply.value:
                        applyResource = APPLY_RESOURCE.ResidentTransferApply;
                        break;
                    case APPLY_TYPE.TreatVerificationApply.value:
                        applyResource = APPLY_RESOURCE.TreatVerificationApply;
                        break;
                    case APPLY_TYPE.TreatVerificationFor110Apply.value:
                        applyResource = APPLY_RESOURCE.TreatVerificationFor110Apply;
                        break;
                    case APPLY_TYPE.EmpPayReturnApply.value:
                        applyResource = APPLY_RESOURCE.EmpPayReturnApply;
                        break;
                    case APPLY_TYPE.ComPostPonePayApply.value:
                        applyResource = APPLY_RESOURCE.ComPostPonePayApply;
                        break;
                    case APPLY_TYPE.NetTreatDeathApply.value:
                        applyResource = APPLY_RESOURCE.NetTreatDeathApply;
                        break;
                    case APPLY_TYPE.NetComCancelApply.value:
                        applyResource = APPLY_RESOURCE.NetComCancelApply;
                        break;

                    case APPLY_TYPE.PersonnelAllotmentApply.value:
                        applyResource = APPLY_RESOURCE.PersonnelAllotmentApply;
                        break;
                     case APPLY_TYPE.PersonInternalTransferApply.value:
                        applyResource = APPLY_RESOURCE.PersonInternalTransferApply;
                        break;
                    //就业安置补助申请
                    case APPLY_TYPE.EmpPlaceApply.value:
                        applyResource = APPLY_RESOURCE.EmpPlaceApply;
                        break;
                    case APPLY_TYPE.OrganRetireApply.value:
                        applyResource = APPLY_RESOURCE.OrganRetireApply;
                        break;
                    case APPLY_TYPE.TempRetireApply.value:
                        applyResource = APPLY_RESOURCE.TempRetireApply;
                        break;
                    case APPLY_TYPE.PlanTransferApply.value:
                        applyResource = APPLY_RESOURCE.PlanTransferApply;
                        break;
                    //职工增员
                    case APPLY_TYPE.RetireRecordApply.value:
                        applyResource = APPLY_RESOURCE.RetireRecordApply;
                        break;
                    case APPLY_TYPE.OnJobEmpCollectApply.value:
                        applyResource = APPLY_RESOURCE.OnJobEmpCollectApply;
                        break;
                    case APPLY_TYPE.RetireCollectApply.value:
                        applyResource = APPLY_RESOURCE.RetireCollectApply;
                        break;
                    case APPLY_TYPE.RetireDeathFor110Apply.value:
                        applyResource = APPLY_RESOURCE.RetireDeathFor110Apply;
                        break;
                    case APPLY_TYPE.RetireDeathFor120Apply.value:
                        applyResource = APPLY_RESOURCE.RetireDeathFor120Apply;
                        break;
                    case APPLY_TYPE.RetireTreatChangeApply.value:
                        applyResource = APPLY_RESOURCE.RetireTreatChangeApply;
                        break;
                    case APPLY_TYPE.SupportEndApply.value:
                        applyResource = APPLY_RESOURCE.SupportEndApply;
                        break;
                    case APPLY_TYPE.MilitarySubsidyApply.value:
                        applyResource = APPLY_RESOURCE.MilitarySubsidyApply;
                        break;
                    case APPLY_TYPE.TeacherSubsidyApply.value:
                        applyResource = APPLY_RESOURCE.TeacherSubsidyApply;
                        break;
                    case APPLY_TYPE.PersionHandInApply.value:
                        applyResource = APPLY_RESOURCE.PersionHandInApply;
                        break;
                    case APPLY_TYPE.PersionAdjustChangeApply.value:
                        applyResource = APPLY_RESOURCE.PersionAdjustChangeApply;
                        break;
                    case APPLY_TYPE.EmpOnWorkApply.value:
                        applyResource = APPLY_RESOURCE.EmpOnWorkApply;
                        break;
                    case APPLY_TYPE.ComInfoCollectApply.value:
                        applyResource=APPLY_RESOURCE.ComInfoCollectApply;
                        break;
                    case APPLY_TYPE.EmpInfoCollectApply.value:
                        applyResource=APPLY_RESOURCE.EmpInfoCollectApply;
                        break;
                    case APPLY_TYPE.SteadySubsidiesApply.value:
                        applyResource=APPLY_RESOURCE.SteadySubsidiesApply;
                        break;
                    case APPLY_TYPE.RepeatPensionApply.value:
                        applyResource=APPLY_RESOURCE.RepeatPensionApply;
                        break;
                    case APPLY_TYPE.SkillUpgradeApply.value:
                        applyResource=APPLY_RESOURCE.SkillUpgradeApply;
                        break;
                    case APPLY_TYPE.UnempApply.value:
                        applyResource=APPLY_RESOURCE.UnempApply;
                        break;
                    case APPLY_TYPE.EnterRecordApply.value:
                        applyResource=APPLY_RESOURCE.EnterRecordApply;
                        break;
                    case APPLY_TYPE.EmergencySubsidyApply.value:
                        applyResource=APPLY_RESOURCE.EmergencySubsidyApply;
                        break;
                    case APPLY_TYPE.ComDivideApply.value:
                        applyResource=APPLY_RESOURCE.ComDivideApply;
                        break;
                    default:
                        applyResource = BusinessApplyConfig.getBusiness(applyType).applyResource;
                    // $log.error('传入业务类型无法匹配', applyType);
                    // return null;
                }
                return ApplyResourceFactory.crtResource(applyResource);
            };
            /**
             * 根据业务类型获取服务对象
             * @param applyType
             */
            factory.getResource = function (applyType) {
                if (applyType.requestPath) {
                    ApplyResourceFactory.crtResource(applyType);
                }
                //获取资源对象
                var rs = dispathService(applyType);
                if (rs !== null) {
                    $log.log('ApplyTypeResourceResolvor获取到资源对象', rs);
                    return rs;
                }
            };
            return factory;
        }]);
