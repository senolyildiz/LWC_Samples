public with sharing class trgHandler4 {
    public static void trgMethod4(List <Case> newCaseList, Map <Id, Case> oldCaseMap) {
        set<Id> accIds = new set<Id>();
        Map<Id, Integer> accountCaseCountMap = new Map<Id, Integer>();
        List<Account> listToUpdate= new List<Account>();


        if(!newCaseList.isEmpty()){
            for (Case newCase: newCaseList){
                if (oldCaseMap !=Null){
                    Case oldCase= oldCaseMap.get(newCase.Id);
                    if (newCase.AccountId != oldCase.AccountId){
                        accIds.add(oldCase.AccountId);
                        accIds.add(newCase.AccountId);
                    }
                    else if (newCase.Isclosed != oldCase.Isclosed){
                        accIds.add(newCase.AccountId);
                    }
                }
               else if (newCase.isClosed){
                accIds.add(newcase.AccountId);
               } 
            }
        }
        if(!accIds.isEmpty()){
            List<aggregateResult> agg= [select AccountId, count(Id) caseCount from Case where AccountId IN: accIds and isClosed =True group by AccountId];
            for (AggregateResult agg : aggResults) {
                accountCaseCountMap.put(
                    (Id)agg.get('AccountId'), 
                    (Integer)agg.get('caseCount')
                );
            }
            List<Account> accList = [Select Id, rating from Account where id IN: accIds];
            for (Account acc: accList){
                Integer closedCaseCount = accountCaseCountMap.containsKey(acc.Id) ? accountCaseCountMap.get(acc.Id) : 0;
                String accountRating;

                if (closedCaseCount > 5){
                    accountRating = 'Hot';
                } else if (closedCaseCount>2){
                    accountRating = 'Warm';
                }else{
                    accountRating = 'Cold';
                }
                acc.rating= accountRating;
                listToUpdate.add(acc);
            }}
            if(!listToUpdate.isEmpty()){
                update listToUpdate;
            }
    }
}