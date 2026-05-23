export const FIELD_LABELS: Record<string, string> = {
  // LetterOfCreditInfo top-level — full alias as defined in lc_info.py
  title:                          'Tiêu đề',
  customerInfo:                   'Thông tin khách hàng',
  typeOfCredit:                   'Loại L/C (Type of credit)',
  expiryInfo:                     'F31D: Ngày và nơi hết hạn (Date and Place of expiry)',
  currencyAmount:                 'F32B: Loại tiền và số tiền (Currency code, Amount)',
  advisingBank:                   'F57: Ngân hàng thông báo (Advising Bank)',
  transferringBank:               'Ngân hàng chuyển nhượng (Transferring Bank)',
  confirmingBank:                 'F58: Ngân hàng xác nhận (Confirming Bank)',
  beneficiary:                    'F59: Người hưởng lợi (Tên và địa chỉ) (Beneficiary\'s name and address)',
  applicant:                      'F50: Người yêu cầu phát hành L/C (Tên và địa chỉ) (Applicant\'s name and address)',
  tolerance:                      'F39A: Dung sai (Tolerance)',
  creditAvailable:                'F41D: Có giá trị xuất trình tại (Credit available with)',
  paymentTerms:                   'F42C: Điều khoản thanh toán (Payment Terms)',
  draftRequired:                  'Yêu cầu hối phiếu (Draft require)',
  partialShipment:                'F43P: Giao hàng từng phần (Partial shipment)',
  transshipment:                  'F43T: Chuyển tải (Transshipment)',
  placeOfReceipt:                 'F44A: Nơi giao hàng (Place of receipt)',
  placeOfDestination:             'F44B: Nơi nhận hàng (Place of destination)',
  portOfLoading:                  'F44E: Cảng bốc hàng/Cảng đi (Port of loading/Airport of Dep.)',
  portOfDischarge:                'F44F: Cảng dỡ hàng/ Cảng đến (Port of discharge/Airport of Dest.)',
  latestShipmentDate:             'F44C: Ngày giao hàng muộn nhất (Latest shipment date)',
  shipmentPeriod:                 'F44D: Thời hạn giao hàng (Shipment Period)',
  goodsDescription:               'F45A: Mô tả hàng hóa/dịch vụ (Description of goods/service(s))',
  documentsRequired:              'F46A: Chứng từ yêu cầu (Documents required)',
  additionalConditions:           'F47A: Các điều kiện bổ sung (Additional conditions)',
  charges:                        'F71D: Phí (Charges)',
  periodForPresentation:          'F48: Thời hạn xuất trình (The period for presentation)',
  confirmationInstruction:        'F49: Chỉ dẫn xác nhận (Confirmation Instruction)',
  relatedContractCustomerAddress: 'Hợp đồng liên quan giữa Khách hàng và Bên thụ hưởng (Related Contract between Customer and Beneficiary)',
  requestVpbankSend:              'Đề nghị VPBank chuyển hồ sơ/chứng từ (VPBank Send Request)',
  creditInformation:              'Credit Information',

  // CustomerInfo
  customerName: 'Customer Name',
  customerCif:  'CIF Number',
  contactInfo:  'Contact Information',

  // ContactInfo
  contactPerson: 'Contact Person',
  phoneNumber:   'Phone Number',
  email:         'Email Address',
  fax:           'Fax Number',

  // ExpiryInfo
  date:  'Expiry Date',
  place: 'Expiry Place',

  // BankInfo
  name:      'Bank Name',
  address:   'Bank Address',
  swiftCode: 'SWIFT Code',

  // ConfirmingBankInfo (overrides above for confirming bank context — both share same key names)
  // The component renders these nested; parent label already provides context.

  // PersonEntityInfo
  nameAddress: 'Name and Address',
  contact:     'Contact Details',

  // ToleranceInfo
  inAmount:    'Tolerance in Amount',
  inQuantity:  'Tolerance in Quantity',
  forEachSize: 'For Each Size',

  // CreditAvailableWith
  availableAt: 'Available At',
  by:          'Available By',

  // GoodsDescription
  info:         'Goods Details',
  shippingTerm: 'Shipping Term',
  incoterm:     'Incoterm Version',

  // VPBankSendRequest
  receiver: 'Receiver Name',
  address_receiver: 'Receiver Address',
  tel:      'Receiver Telephone',

  // CreditInformation
  securityAndFunding: 'Security Measures & Sources of Fund',
  accounts:           'Account Instruction',
  application:        'Application',

  // SecurityAndFunding (no alias — uses snake_case → camelCase keys)
  marginDepositAmount:             'Margin Deposit Amount',
  otherSecurityMeasureAccordingTo: 'Security Measure Document Type',
  otherSecurityMeasureNo:          'Security Measure Reference No.',
  otherSecurityMeasureDate:        'Security Measure Date',
  sourcesOfFund:                   'Sources of Fund',

  // Accounts (no alias — uses snake_case → camelCase keys)
  marginDepositDebitAccount: 'Margin Deposit Account',
  chargeDebitAccount:        'Charge Debit Account',
  paymentDebitAccount:       'Payment Debit Account',

  // Application (no alias — uses snake_case → camelCase keys)
  type:         'Application Type',
  contractNo:   'Contract No.',
  contractDate: 'Contract Date',
};
