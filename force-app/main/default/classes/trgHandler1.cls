public with sharing class trgHandler1 {
    public static void trgmethod1(List<Opportunity> oppList, Map<Id, Opportunity> oldMap) {
        Set<Id> parentIds = new Set<Id>();
        if (!oppList.isEmpty()) {
            for (Opportunity newOpp : oppList) {
                if (oldMap != null) {
                    Opportunity oldOpp = oldMap.get(newOpp.Id);
                    if (oldOpp.AccountId != newOpp.AccountId) {
                        parentIds.add(oldOpp.AccountId);
                        parentIds.add(newOpp.AccountId);
                    } else {
                        parentIds.add(newOpp.AccountId);
                    }
                } else {
                    parentIds.add(newOpp.AccountId);
                }
            }
        }

        List<Account> accList = [SELECT maxOpp__c,maxOppName__c, (Select Name, Amount from Opportunities where amount !=Null order by amount Desc Limit 1) FROM Account WHERE Id IN :parentIds];
        List<Account> listToUpdate = New List <Account>();

        if (!accList.isEmpty()) {
            for (Account acc : accList) {
                if (!acc.Opportunities.isEmpty()) {
                    acc.maxOpp__c = acc.Opportunities[0].Amount;
                    acc.maxOppName__c = acc.Opportunities[0].Name;
                    listToUpdate.add(acc);
                }
                else {
                    acc.maxOpp__c = Null;
                    listToUpdate.add(acc);
                }
    }
}
if (!listToUpdate.isEmpty()) {
update listToUpdate;

}
}
}