trigger updateSalary on Employee__c (after Insert, after update, after delete, after undelete ) {
if (trigger.isAfter && trigger.isUpdate){
    trgHandler.trgMethod(trigger.new, trigger.oldMap);
   
}


else if (trigger.isAfter && trigger.isDelete){
    trgHandler.trgMethod(trigger.old, null);
    
}

else {
    trgHandler.trgMethod(trigger.new, null);
    
}
}