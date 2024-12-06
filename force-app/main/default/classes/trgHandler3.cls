public with sharing class trgHandler3 {
    public static void trgMethod3(List<OpportunityLineItem> OliList) {
       Set<Id> OppIds = new Set<Id>();
       Map<Id, Decimal> oliMap = new Map<Id, Decimal>();
       List<Account> listToUpdate = New List <Account>();
        
       
       if (!OliList.isEmpty()){
            for (OpportunityLineItem oli : OliList) {
            oppIds.add(oli.opportunityId);
            }}
        if (!oppIds.isEmpty()){}
            List<Opportunity> oppList = [SELECT Id, AccountId FROM Opportunity WHERE Id IN :oppIds];
            if (!oppList.isEmpty()){
            for (Opportunity opp : oppList) {
            oliMap.put(opp.AccountId, 0);
        }}

        for (AggregateResult aggr : [Select count(Id) oli, opportunity.AccountId from OpportunityLineItem where opportunity.AccountId IN:oliMap.keySet() group by opportunity.AccountId ]) {
            oliMap.put((Id)aggr.get('AccountId'), (Decimal)aggr.get('oli'));
        }

        for(Id accId : oliMap.keySet()){
            Account acc = new Account();
            acc.Id = accId;
            acc.Number_of_Products__c = oliMap.get(accId);
            listToUpdate.add(acc);


        }

        if (!listToUpdate.isEmpty()){
           try {
               update listToUpdate;
           } catch (Exception ex) {
            System.debug('Error while updating account records-->'+ex.getMessage());
           }
        }

   }}
