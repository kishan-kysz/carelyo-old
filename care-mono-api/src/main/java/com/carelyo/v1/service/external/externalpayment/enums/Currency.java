package com.carelyo.v1.service.external.externalpayment.enums;

public enum Currency {

    // African Currencies
    AOA("Angolan Kwanza"),
    BWP("Botswana Pula"),
    DZD("Algerian Dinar"),
    EGP("Egyptian Pound"),
    ETB("Ethiopian Birr"),
    GHS("Ghanaian Cedi"),
    GMD("Gambian Dalasi"),
    KES("Kenyan Shilling"),
    LSL("Lesotho Loti"),
    MAD("Moroccan Dirham"),
    MGA("Malagasy Ariary"),
    MUR("Mauritian Rupee"),
    MWK("Malawian Kwacha"),
    NAD("Namibian Dollar"),
    NGN("Nigerian Naira"),
    RWF("Rwandan Franc"),
    SCR("Seychellois Rupee"),
    SDG("Sudanese Pound"),
    SZL("Swazi Lilangeni"),
    TND("Tunisian Dinar"),
    TZS("Tanzanian Shilling"),
    UGX("Ugandan Shilling"),
    ZAR("South African Rand"),
    ZMW("Zambian Kwacha"),
    ZWL("Zimbabwean Dollar"),

    // Other Common Currencies
    USD("US Dollar"),
    EUR("Euro"),
    GBP("British Pound Sterling");
    
    private final String description;

    Currency(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}