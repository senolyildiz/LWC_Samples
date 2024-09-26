public with sharing class AccountManagementController {
    @ AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getTypePicklistValues() {
        List<Map<String, String>> options = new List<Map<String, String>>();
        
        // Describe the field to get its metadata
        Schema.DescribeFieldResult fieldResult = Account.Type.getDescribe();
        
        // Get the picklist values
        List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();
        system.debug(picklistEntries);
        // Loop through the picklist values and add them to the options list
        for (Schema.PicklistEntry entry : picklistEntries) {
            Map<String, String> option = new Map<String, String>();
            option.put('value', entry.getValue()); // The actual value stored in the database
            option.put('label', entry.getLabel()); // The user-friendly label
            options.add(option);
        }
        system.debug(options);
        return options;
    }

    @AuraEnabled
    public static void createAccount(Account acc){
        try {
            system.debug(acc);
            insert acc;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(){
        try {
            return [SELECT Id, Name, Type, Industry, Phone, AccountNumber FROM Account Limit 10];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());

        }
    }
    @AuraEnabled
    public static void updateAccount(List<Account> updatedAccountList){
        try {
            update updatedAccountList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());

        } 
    }

}