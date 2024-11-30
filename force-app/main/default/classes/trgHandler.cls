public with sharing class trgHandler {
    public static void trgMethod(List<Employee__c> empList, map<id,Employee__c> oldMap) {
        Set<Id> parentIds = new Set<Id>();
        for(Employee__c newEmp : empList){
           if (oldMap!=Null){
            Employee__c oldEmp= oldMap.get(newEmp.Id);
            if (oldEmp.Tech_Firm__c != newEmp.Tech_Firm__c){
                parentIds.add(oldEmp.Tech_Firm__c);
                parentIds.add(newEmp.Tech_Firm__c);}
            else {parentIds.add(newEmp.Tech_Firm__c);}
        }
            else {parentIds.add(newEmp.Tech_Firm__c);}
            

      }
      List<AggregateResult> aggrList= [Select Tech_Firm__c tfId, Max(Salary__c) maxSalary, Min(Salary__c) minSalary From Employee__c where Tech_Firm__c IN: parentIds group by Tech_Firm__c];
      Map <Id, Tech_Firm__c> mapToUpdate= new Map <Id, Tech_Firm__c>();
      for (Id Ids: parentIds){
        Tech_Firm__c tf = new Tech_Firm__c();
        tf.Id=Ids;
        tf.Max_Salary__c=0;
        tf.Min_Salary__c=0;
        maptoUpdate.put(tf.Id, tf);
      }
      if (!aggrList.isEmpty()){
        for (AggregateResult aggr: aggrList){
            Tech_Firm__c tf= mapToUpdate.get((Id)aggr.get('tfId'));
            tf.Max_Salary__c= (Decimal)aggr.get('maxSalary');
            tf.Min_Salary__c= (Decimal)aggr.get('minSalary');
        }}
        if (mapToUpdate.size()>0){
            Update mapToUpdate.values();

}
}}