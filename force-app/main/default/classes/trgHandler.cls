public with sharing class trgHandler {
    public static void trgMethod(List<Employee__c> empList, Map<Id, Employee__c> oldMap) {
        Set<Id> parentIds = new Set<Id>();
        for (Employee__c newEmp : empList) {
            if (oldMap != null) {
                Employee__c oldEmp = oldMap.get(newEmp.Id);
                if (oldEmp.Tech_Firm__c != newEmp.Tech_Firm__c) {
                    parentIds.add(oldEmp.Tech_Firm__c);
                    parentIds.add(newEmp.Tech_Firm__c);
                } else {
                    parentIds.add(newEmp.Tech_Firm__c);
                }
            } else {
                parentIds.add(newEmp.Tech_Firm__c);
            }
        }
        List<AggregateResult> aggrList = [
            SELECT Tech_Firm__c tfId, MAX(Salary__c) maxSalary, MIN(Salary__c) minSalary
            FROM Employee__c
            WHERE Tech_Firm__c IN :parentIds
            GROUP BY Tech_Firm__c
        ];
        Map<Id, Tech_Firm__c> mapToUpdate = new Map<Id, Tech_Firm__c>();
        for (Id id : parentIds) {
            Tech_Firm__c tf = new Tech_Firm__c();
            tf.Id = id;
            tf.Max_Salary__c = 0;
            tf.Min_Salary__c = 0;
            mapToUpdate.put(tf.Id, tf);
        }
        if (!aggrList.isEmpty()) {
            for (AggregateResult aggr : aggrList) {
                Tech_Firm__c tf = mapToUpdate.get((Id) aggr.get('tfId'));
                tf.Max_Salary__c = (Decimal) aggr.get('maxSalary');
                tf.Min_Salary__c = (Decimal) aggr.get('minSalary');
            }
        }
        if (!mapToUpdate.isEmpty()) {
            update mapToUpdate.values();
        }
    }

   
}