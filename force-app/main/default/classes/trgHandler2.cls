public with sharing class trgHandler2 {
    public static void trgMethod2(List<Account> accList, Map<Id, Account> oldMap) {
        Set<Id> accIds = new Set<Id>();
        if (!accList.isEmpty()) {
            for (Account newAcc : accList) {
                if (oldMap != null && oldMap.containsKey(newAcc.Id)) {
                    Account oldAcc = oldMap.get(newAcc.Id);
                    if (oldAcc.Close_all_Opps__c == false && newAcc.Close_all_Opps__c == true) {
                        accIds.add(newAcc.Id);
                    }
                }
            }
        }
        if (!accIds.isEmpty()) {
            List<Opportunity> OppList = [SELECT StageName, AccountId FROM Opportunity WHERE AccountId IN :accIds AND StageName != 'Discharged'];
            List<Opportunity> OppToUpdate = new List<Opportunity>();
            if (!OppList.isEmpty()) {
                for (Opportunity Opp : OppList) {
                    Opp.StageName = 'Discharged';
                    OppToUpdate.add(Opp);
                }
                if (!OppToUpdate.isEmpty()) {
                    update OppToUpdate;
                }
            }
        }
    }
}

