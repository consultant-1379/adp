// ============================================================================================= //
module.exports = () => {
  const dateFormat = (daysAgo = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toJSON().split('T')[0];
  };
  
  const sixMonthsAgoDate = dateFormat(180);
// --------------------------------------------------------------------------------------------- //
  const innersourceuserhistory = [
    {
      _id: '602a7caf46230c3bff870be0',
      signum: 'etesase',
      name: 'Test User',
      email: 'etesase-user@adp-test.com',
      organisation: 'BDGS SA PC PDU UDM',
      peopleFinder: {
        profileID: 'etesase',
        chargedCC: null,
        managerProfileID: 'test',
        managerFullName: 'test',
        legalManagerFullName: 'test',
        assistantProfileID: null,
        assistantFullName: null,
        companyName: 'Ericsson Communications Co. Ltd.',
        companyType: 'Ericsson company',
        jobArea: '76 Product Development',
        jobFamily: '7600 Product Development',
        job: 'Developer',
        firstName: 'Test',
        lastName: 'User',
        localFirstName: 'Test',
        localLastName: 'User',
        fullName: 'etesase',
        localName: 'Test User',
        company: 'CBC',
        department: null,
        telephone: null,
        telephoneSource: null,
        mobile: null,
        mobileSource: null,
        fax: null,
        ecnExtension: null,
        email: 'yanhua.ma@ericsson.com',
        emailSource: 'source: AD Office365',
        displayName: 'Test User',
        roomNumber: 'N/A',
        jobTitle: 'Software Developer',
        positionId: '123123',
        costCentre: '2520016524',
        ericssonConnection: 'Non-Ericsson',
        employeeNumber: '23760009',
        payrollNumber: null,
        status: 'Active',
        initials: null,
        country: 'Ireland',
        street: 'Building A No.1068',
        city: 'Dubline',
        postalCode: '200335',
        countryCode: 'IE',
        buildingNumber: 'SH35',
        operationalUnit: 'BDGS SA PC PDU UDM E&A Development 2',
        organizationalUnitShortName: 'BDGSLFOB',
        organizationalUnitId: '31567073',
        employeeType: 'Workforce',
        isOpManager: 'N',
        hrContact: 'Y',
        signType: 'I',
        nickName: null,
        funcidowner: null,
        distinguishedName: null,
        owner: null,
        member: null,
        mailNickname: null,
        managedBy: null,
        memberOf: null,
        otherTelephone: null,
        info: null,
        assistantPhone: null,
        ownerDisplayname: null,
        objectClass: null,
        objectCategory: null,
        authOrig: null,
        authOrigBL: null,
        unixUid: '7374969',
        destinationIndicator: null,
        srchMOD: 'exact',
        srchONLYMGR: false,
        srchONLYEMP: false,
        functionalUserIdList: false,
        pdlDddlList: false,
        emailHelp: 'email_AD_EBR',
        telephoneHelp: 'no_info',
        mobileHelp: 'no_info',
        faxHelp: 'no_info',
        cityHelp: 'city_EBR',
        zipHelp: 'zip_EBR',
        officeHelp: 'office_EBR',
        countryHelp: 'Country_EBR',
        streetHelp: 'Street_EBR',
        contractEndDateHelp: 'contractEnd_EBR',
        office: 'CN SH35 N/A',
        resignDate: '2021-06-04',
        manager: false,
        modifyTimestamp: '2020-12-24 13:07:11',
        id: 'etesase',
        funcIdOwner: null,
        operationalManagerFullName: null,
        operationalManager: null,
      },
      snapshot_date: new Date('2021-01-15T13:52:47.883Z'),
    },
    {
      _id: '602a7caf46230c3bff870ty6',
      signum: 'etesase',
      name: 'Test User',
      email: 'etesase-user@adp-test.com',
      organisation: 'RDGS PC',
      peopleFinder: {
        profileID: 'etesase',
        chargedCC: null,
        managerProfileID: 'test',
        managerFullName: 'test',
        legalManagerFullName: 'test',
        assistantProfileID: null,
        assistantFullName: null,
        companyName: 'Ericsson Communications Co. Ltd.',
        companyType: 'Ericsson company',
        jobArea: '76 Product Development',
        jobFamily: '7600 Product Development',
        job: 'Developer',
        firstName: 'Test',
        lastName: 'User',
        localFirstName: 'Test',
        localLastName: 'User',
        fullName: 'etesuse',
        localName: 'Test User',
        company: 'CBC',
        department: null,
        telephone: null,
        telephoneSource: null,
        mobile: null,
        mobileSource: null,
        fax: null,
        ecnExtension: null,
        email: 'yanhua.ma@ericsson.com',
        emailSource: 'source: AD Office365',
        displayName: 'Test User',
        roomNumber: 'N/A',
        jobTitle: 'Software Developer',
        positionId: '123123',
        costCentre: '2520016524',
        ericssonConnection: 'Non-Ericsson',
        employeeNumber: '23760009',
        payrollNumber: null,
        status: 'Active',
        initials: null,
        country: 'Ireland',
        street: 'Building A No.1068',
        city: 'Dubline',
        postalCode: '200335',
        countryCode: 'IE',
        buildingNumber: 'SH35',
        operationalUnit: 'RDGS PC PDU UDM E&A Development 2',
        organizationalUnitShortName: 'BDGSLFOB',
        organizationalUnitId: '31567073',
        employeeType: 'Workforce',
        isOpManager: 'N',
        hrContact: 'Y',
        signType: 'I',
        nickName: null,
        funcidowner: null,
        distinguishedName: null,
        owner: null,
        member: null,
        mailNickname: null,
        managedBy: null,
        memberOf: null,
        otherTelephone: null,
        info: null,
        assistantPhone: null,
        ownerDisplayname: null,
        objectClass: null,
        objectCategory: null,
        authOrig: null,
        authOrigBL: null,
        unixUid: '7374969',
        destinationIndicator: null,
        srchMOD: 'exact',
        srchONLYMGR: false,
        srchONLYEMP: false,
        functionalUserIdList: false,
        pdlDddlList: false,
        emailHelp: 'email_AD_EBR',
        telephoneHelp: 'no_info',
        mobileHelp: 'no_info',
        faxHelp: 'no_info',
        cityHelp: 'city_EBR',
        zipHelp: 'zip_EBR',
        officeHelp: 'office_EBR',
        countryHelp: 'Country_EBR',
        streetHelp: 'Street_EBR',
        contractEndDateHelp: 'contractEnd_EBR',
        office: 'CN SH35 N/A',
        resignDate: '2021-06-04',
        manager: false,
        modifyTimestamp: '2020-12-24 13:07:11',
        id: 'etesase',
        funcIdOwner: null,
        operationalManagerFullName: null,
        operationalManager: null,
      },
      snapshot_date: new Date('2021-02-14T13:52:47.883Z'),
    },
    {
      _id: '603cfc046a57e80007f46dbb',
      signum: 'etesase',
      name: 'Test User',
      email: 'etesase-user@adp-test.com',
      organisation: 'RDGS PC',
      peopleFinder: {
        profileID: 'etesase',
        chargedCC: null,
        managerProfileID: 'test',
        managerFullName: 'test',
        legalManagerFullName: 'test',
        assistantProfileID: null,
        assistantFullName: null,
        companyName: 'Ericsson Communications Co. Ltd.',
        companyType: 'Ericsson company',
        jobArea: '76 Product Development',
        jobFamily: '7600 Product Development',
        job: 'Developer',
        firstName: 'Test',
        lastName: 'User',
        localFirstName: 'Test',
        localLastName: 'User',
        fullName: 'etesuse',
        localName: 'Test User',
        company: 'CBC',
        department: null,
        telephone: null,
        telephoneSource: null,
        mobile: null,
        mobileSource: null,
        fax: null,
        ecnExtension: null,
        email: 'yanhua.ma@ericsson.com',
        emailSource: 'source: AD Office365',
        displayName: 'Test User',
        roomNumber: 'N/A',
        jobTitle: 'Software Developer',
        positionId: '123123',
        costCentre: '2520016524',
        ericssonConnection: 'Non-Ericsson',
        employeeNumber: '23760009',
        payrollNumber: null,
        status: 'Active',
        initials: null,
        country: 'Ireland',
        street: 'Building A No.1068',
        city: 'Dubline',
        postalCode: '200335',
        countryCode: 'IE',
        buildingNumber: 'SH35',
        operationalUnit: 'RDGS PC PDU UDM E&A Development 2',
        organizationalUnitShortName: 'BDGSLFOB',
        organizationalUnitId: '31567073',
        employeeType: 'Workforce',
        isOpManager: 'N',
        hrContact: 'Y',
        signType: 'I',
        nickName: null,
        funcidowner: null,
        distinguishedName: null,
        owner: null,
        member: null,
        mailNickname: null,
        managedBy: null,
        memberOf: null,
        otherTelephone: null,
        info: null,
        assistantPhone: null,
        ownerDisplayname: null,
        objectClass: null,
        objectCategory: null,
        authOrig: null,
        authOrigBL: null,
        unixUid: '7374969',
        destinationIndicator: null,
        srchMOD: 'exact',
        srchONLYMGR: false,
        srchONLYEMP: false,
        functionalUserIdList: false,
        pdlDddlList: false,
        emailHelp: 'email_AD_EBR',
        telephoneHelp: 'no_info',
        mobileHelp: 'no_info',
        faxHelp: 'no_info',
        cityHelp: 'city_EBR',
        zipHelp: 'zip_EBR',
        officeHelp: 'office_EBR',
        countryHelp: 'Country_EBR',
        streetHelp: 'Street_EBR',
        contractEndDateHelp: 'contractEnd_EBR',
        office: 'CN SH35 N/A',
        resignDate: '2021-06-04',
        manager: false,
        modifyTimestamp: '2020-12-24 13:07:11',
        id: 'etesase',
        funcIdOwner: null,
        operationalManagerFullName: null,
        operationalManager: null,
      },
      snapshot_date: new Date('2021-02-14T13:52:56.883Z'),
    },
    {
      _id: '602d00476a57e80007f46hjk',
      signum: 'etesase',
      name: 'Test User',
      email: 'etesase-user@adp-test.com',
      organisation: 'RDGS PC',
      peopleFinder: {
        profileID: 'etesase',
        chargedCC: null,
        managerProfileID: 'test',
        managerFullName: 'test',
        legalManagerFullName: 'test',
        assistantProfileID: null,
        assistantFullName: null,
        companyName: 'Ericsson Communications Co. Ltd.',
        companyType: 'Ericsson company',
        jobArea: '76 Product Development',
        jobFamily: '7600 Product Development',
        job: 'Developer',
        firstName: 'Test',
        lastName: 'User',
        localFirstName: 'Test',
        localLastName: 'User',
        fullName: 'etesuse',
        localName: 'Test User',
        company: 'CBC',
        department: null,
        telephone: null,
        telephoneSource: null,
        mobile: null,
        mobileSource: null,
        fax: null,
        ecnExtension: null,
        email: 'yanhua.ma@ericsson.com',
        emailSource: 'source: AD Office365',
        displayName: 'Test User',
        roomNumber: 'N/A',
        jobTitle: 'Software Developer',
        positionId: '123123',
        costCentre: '2520016524',
        ericssonConnection: 'Non-Ericsson',
        employeeNumber: '23760009',
        payrollNumber: null,
        status: 'Active',
        initials: null,
        country: 'Ireland',
        street: 'Building A No.1068',
        city: 'Dubline',
        postalCode: '200335',
        countryCode: 'IE',
        buildingNumber: 'SH35',
        operationalUnit: 'RDGS PC PDU UDM E&A Development 2',
        organizationalUnitShortName: 'BDGSLFOB',
        organizationalUnitId: '31567073',
        employeeType: 'Workforce',
        isOpManager: 'N',
        hrContact: 'Y',
        signType: 'I',
        nickName: null,
        funcidowner: null,
        distinguishedName: null,
        owner: null,
        member: null,
        mailNickname: null,
        managedBy: null,
        memberOf: null,
        otherTelephone: null,
        info: null,
        assistantPhone: null,
        ownerDisplayname: null,
        objectClass: null,
        objectCategory: null,
        authOrig: null,
        authOrigBL: null,
        unixUid: '7374969',
        destinationIndicator: null,
        srchMOD: 'exact',
        srchONLYMGR: false,
        srchONLYEMP: false,
        functionalUserIdList: false,
        pdlDddlList: false,
        emailHelp: 'email_AD_EBR',
        telephoneHelp: 'no_info',
        mobileHelp: 'no_info',
        faxHelp: 'no_info',
        cityHelp: 'city_EBR',
        zipHelp: 'zip_EBR',
        officeHelp: 'office_EBR',
        countryHelp: 'Country_EBR',
        streetHelp: 'Street_EBR',
        contractEndDateHelp: 'contractEnd_EBR',
        office: 'CN SH35 N/A',
        resignDate: '2021-06-04',
        manager: false,
        modifyTimestamp: '2020-12-24 13:07:11',
        id: 'etesase',
        funcIdOwner: null,
        operationalManagerFullName: null,
        operationalManager: null,
      },
      snapshot_date: new Date('2021-02-14T13:53:56.883Z'),
    },
    {
      _id: '602d00476a57e80007f46gho',
      signum: 'eterase',
      name: 'Rase User',
      email: 'eterase-user@adp-test.com',
      organisation: 'BNEW DNEW CR',
      peopleFinder: {
        profileID: 'etesuse2',
        chargedCC: null,
        managerProfileID: 'test',
        managerFullName: 'test',
        legalManagerFullName: 'test',
        assistantProfileID: null,
        assistantFullName: null,
        companyName: 'Ericsson Communications Co. Ltd.',
        companyType: 'Ericsson company',
        jobArea: '76 Product Development',
        jobFamily: '7600 Product Development',
        job: 'Developer',
        firstName: 'Test',
        lastName: 'User',
        localFirstName: 'Test',
        localLastName: 'User',
        fullName: 'eterase',
        localName: 'Rase User',
        company: 'CBC',
        department: null,
        telephone: null,
        telephoneSource: null,
        mobile: null,
        mobileSource: null,
        fax: null,
        ecnExtension: null,
        email: 'yanhua.ma@ericsson.com',
        emailSource: 'source: AD Office365',
        displayName: 'Test User2',
        roomNumber: 'N/A',
        jobTitle: 'Software Developer',
        positionId: '123123',
        costCentre: '2520016524',
        ericssonConnection: 'Non-Ericsson',
        employeeNumber: '23760009',
        payrollNumber: null,
        status: 'Active',
        initials: null,
        country: 'Ireland',
        street: 'Building A No.1068',
        city: 'Dubline',
        postalCode: '200335',
        countryCode: 'IE',
        buildingNumber: 'SH35',
        operationalUnit: 'BNEW DNEW CR',
        organizationalUnitShortName: 'BNEW DNEW CR',
        organizationalUnitId: '31567073',
        employeeType: 'Workforce',
        isOpManager: 'N',
        hrContact: 'Y',
        signType: 'I',
        nickName: null,
        funcidowner: null,
        distinguishedName: null,
        owner: null,
        member: null,
        mailNickname: null,
        managedBy: null,
        memberOf: null,
        otherTelephone: null,
        info: null,
        assistantPhone: null,
        ownerDisplayname: null,
        objectClass: null,
        objectCategory: null,
        authOrig: null,
        authOrigBL: null,
        unixUid: '7374969',
        destinationIndicator: null,
        srchMOD: 'exact',
        srchONLYMGR: false,
        srchONLYEMP: false,
        functionalUserIdList: false,
        pdlDddlList: false,
        emailHelp: 'email_AD_EBR',
        telephoneHelp: 'no_info',
        mobileHelp: 'no_info',
        faxHelp: 'no_info',
        cityHelp: 'city_EBR',
        zipHelp: 'zip_EBR',
        officeHelp: 'office_EBR',
        countryHelp: 'Country_EBR',
        streetHelp: 'Street_EBR',
        contractEndDateHelp: 'contractEnd_EBR',
        office: 'CN SH35 N/A',
        resignDate: '2021-06-04',
        manager: false,
        modifyTimestamp: '2020-12-24 13:07:11',
        id: 'etesase',
        funcIdOwner: null,
        operationalManagerFullName: null,
        operationalManager: null,
      },
      snapshot_date: new Date(sixMonthsAgoDate+'T13:53:56.883Z'),
    },
    {
      _id: '602d00476a57e80007f46hrt',
      signum: 'etesuse2',
      name: 'Test User2',
      email: 'test-user2@adp-test.com',
      organisation: 'BNEW DNEW CR',
      peopleFinder: {
        profileID: 'etesuse2',
        chargedCC: null,
        managerProfileID: 'test2',
        managerFullName: 'test2',
        legalManagerFullName: 'test2',
        assistantProfileID: null,
        assistantFullName: null,
        companyName: 'Ericsson Communications Co. Ltd.',
        companyType: 'Ericsson company',
        jobArea: '76 Product Development',
        jobFamily: '7600 Product Development',
        job: 'Developer',
        firstName: 'Test2',
        lastName: 'User2',
        localFirstName: 'Test2',
        localLastName: 'User2',
        fullName: 'etesuse2',
        localName: 'Test User2',
        company: 'CBC',
        department: null,
        telephone: null,
        telephoneSource: null,
        mobile: null,
        mobileSource: null,
        fax: null,
        ecnExtension: null,
        email: 'yanhua.ma@ericsson.com',
        emailSource: 'source: AD Office365',
        displayName: 'Test User2',
        roomNumber: 'N/A',
        jobTitle: 'Software Developer',
        positionId: '123123',
        costCentre: '2520016524',
        ericssonConnection: 'Non-Ericsson',
        employeeNumber: '23760009',
        payrollNumber: null,
        status: 'Active',
        initials: null,
        country: 'Ireland',
        street: 'Building A No.1068',
        city: 'Dubline',
        postalCode: '200335',
        countryCode: 'IE',
        buildingNumber: 'SH35',
        operationalUnit: 'BNEW DNEW CR',
        organizationalUnitShortName: 'BNEW DNEW CR',
        organizationalUnitId: '31567073',
        employeeType: 'Workforce',
        isOpManager: 'N',
        hrContact: 'Y',
        signType: 'I',
        nickName: null,
        funcidowner: null,
        distinguishedName: null,
        owner: null,
        member: null,
        mailNickname: null,
        managedBy: null,
        memberOf: null,
        otherTelephone: null,
        info: null,
        assistantPhone: null,
        ownerDisplayname: null,
        objectClass: null,
        objectCategory: null,
        authOrig: null,
        authOrigBL: null,
        unixUid: '7374969',
        destinationIndicator: null,
        srchMOD: 'exact',
        srchONLYMGR: false,
        srchONLYEMP: false,
        functionalUserIdList: false,
        pdlDddlList: false,
        emailHelp: 'email_AD_EBR',
        telephoneHelp: 'no_info',
        mobileHelp: 'no_info',
        faxHelp: 'no_info',
        cityHelp: 'city_EBR',
        zipHelp: 'zip_EBR',
        officeHelp: 'office_EBR',
        countryHelp: 'Country_EBR',
        streetHelp: 'Street_EBR',
        contractEndDateHelp: 'contractEnd_EBR',
        office: 'CN SH35 N/A',
        resignDate: '2021-06-04',
        manager: false,
        modifyTimestamp: '2020-12-24 13:07:11',
        id: 'etesase',
        funcIdOwner: null,
        operationalManagerFullName: null,
        operationalManager: null,
      },
      snapshot_date: new Date(sixMonthsAgoDate+'T13:53:56.883Z'),
    },
    {
      _id: '602d00476a57e80007f46dbd',
      signum: 'etesuse',
      name: 'Test User',
      email: 'etesuse-user@adp-test.com',
      organisation: 'RDGS PC',
      peopleFinder: {
        profileID: 'etesuse',
        chargedCC: null,
        managerProfileID: 'test',
        managerFullName: 'test',
        legalManagerFullName: 'test',
        assistantProfileID: null,
        assistantFullName: null,
        companyName: 'Ericsson Communications Co. Ltd.',
        companyType: 'Ericsson company',
        jobArea: '76 Product Development',
        jobFamily: '7600 Product Development',
        job: 'Developer',
        firstName: 'Test',
        lastName: 'User',
        localFirstName: 'Test',
        localLastName: 'User',
        fullName: 'etesuse',
        localName: 'Test User',
        company: 'CBC',
        department: null,
        telephone: null,
        telephoneSource: null,
        mobile: null,
        mobileSource: null,
        fax: null,
        ecnExtension: null,
        email: 'yanhua.ma@ericsson.com',
        emailSource: 'source: AD Office365',
        displayName: 'Test User',
        roomNumber: 'N/A',
        jobTitle: 'Software Developer',
        positionId: '123123',
        costCentre: '2520016524',
        ericssonConnection: 'Non-Ericsson',
        employeeNumber: '23760009',
        payrollNumber: null,
        status: 'Active',
        initials: null,
        country: 'Ireland',
        street: 'Building A No.1068',
        city: 'Dubline',
        postalCode: '200335',
        countryCode: 'IE',
        buildingNumber: 'SH35',
        operationalUnit: 'RDGS PC PDU UDM E&A Development 2',
        organizationalUnitShortName: 'BDGSLFOB',
        organizationalUnitId: '31567073',
        employeeType: 'Workforce',
        isOpManager: 'N',
        hrContact: 'Y',
        signType: 'I',
        nickName: null,
        funcidowner: null,
        distinguishedName: null,
        owner: null,
        member: null,
        mailNickname: null,
        managedBy: null,
        memberOf: null,
        otherTelephone: null,
        info: null,
        assistantPhone: null,
        ownerDisplayname: null,
        objectClass: null,
        objectCategory: null,
        authOrig: null,
        authOrigBL: null,
        unixUid: '7374969',
        destinationIndicator: null,
        srchMOD: 'exact',
        srchONLYMGR: false,
        srchONLYEMP: false,
        functionalUserIdList: false,
        pdlDddlList: false,
        emailHelp: 'email_AD_EBR',
        telephoneHelp: 'no_info',
        mobileHelp: 'no_info',
        faxHelp: 'no_info',
        cityHelp: 'city_EBR',
        zipHelp: 'zip_EBR',
        officeHelp: 'office_EBR',
        countryHelp: 'Country_EBR',
        streetHelp: 'Street_EBR',
        contractEndDateHelp: 'contractEnd_EBR',
        office: 'CN SH35 N/A',
        resignDate: '2021-06-04',
        manager: false,
        modifyTimestamp: '2020-12-24 13:07:11',
        id: 'etesase',
        funcIdOwner: null,
        operationalManagerFullName: null,
        operationalManager: null,
      },
      snapshot_date: new Date('2021-02-14T13:53:56.883Z'),
    },
    {
      _id: '602d00476a57e80007f46345',
      signum: 'eterase',
      name: 'Rese User',
      email: 'eterase-user@adp-test.com',
      peopleFinder: {
        profileID: 'eterase',
        chargedCC: null,
        managerProfileID: 'test',
        managerFullName: 'test',
        legalManagerFullName: 'test',
        assistantProfileID: null,
        assistantFullName: null,
        companyName: 'Ericsson Communications Co. Ltd.',
        companyType: 'Ericsson company',
        jobArea: '76 Product Development',
        jobFamily: '7600 Product Development',
        job: 'Developer',
        firstName: 'Test',
        lastName: 'User',
        localFirstName: 'Test',
        localLastName: 'User',
        fullName: 'etesuse',
        localName: 'Test User',
        company: 'CBC',
        department: null,
        telephone: null,
        telephoneSource: null,
        mobile: null,
        mobileSource: null,
        fax: null,
        ecnExtension: null,
        email: 'yanhua.ma@ericsson.com',
        emailSource: 'source: AD Office365',
        displayName: 'Rase User',
        roomNumber: 'N/A',
        jobTitle: 'Software Developer',
        positionId: '123123',
        costCentre: '2520016524',
        ericssonConnection: 'Non-Ericsson',
        employeeNumber: '23760009',
        payrollNumber: null,
        status: 'Active',
        initials: null,
        country: 'Ireland',
        street: 'Building A No.1068',
        city: 'Dubline',
        postalCode: '200335',
        countryCode: 'IE',
        buildingNumber: 'SH35',
        operationalUnit: null,
        organizationalUnitShortName: 'BDGSLFOB',
        organizationalUnitId: '31567073',
        employeeType: 'Workforce',
        isOpManager: 'N',
        hrContact: 'Y',
        signType: 'I',
        nickName: null,
        funcidowner: null,
        distinguishedName: null,
        owner: null,
        member: null,
        mailNickname: null,
        managedBy: null,
        memberOf: null,
        otherTelephone: null,
        info: null,
        assistantPhone: null,
        ownerDisplayname: null,
        objectClass: null,
        objectCategory: null,
        authOrig: null,
        authOrigBL: null,
        unixUid: '7374969',
        destinationIndicator: null,
        srchMOD: 'exact',
        srchONLYMGR: false,
        srchONLYEMP: false,
        functionalUserIdList: false,
        pdlDddlList: false,
        emailHelp: 'email_AD_EBR',
        telephoneHelp: 'no_info',
        mobileHelp: 'no_info',
        faxHelp: 'no_info',
        cityHelp: 'city_EBR',
        zipHelp: 'zip_EBR',
        officeHelp: 'office_EBR',
        countryHelp: 'Country_EBR',
        streetHelp: 'Street_EBR',
        contractEndDateHelp: 'contractEnd_EBR',
        office: 'CN SH35 N/A',
        resignDate: '2021-06-04',
        manager: false,
        modifyTimestamp: '2020-12-24 13:07:11',
        id: 'eterase',
        funcIdOwner: null,
        operationalManagerFullName: null,
        operationalManager: null,
      },
      snapshot_date: new Date('2021-01-14T13:53:56.883Z'),
    },
  ];
  return innersourceuserhistory;
// --------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
