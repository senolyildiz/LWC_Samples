trigger maxOpp on Opportunity (after insert, after update, after delete, after undelete) {
    if (trigger.isAfter && trigger.isUpdate){
        trgHandler1.trgMethod1(trigger.new, trigger.oldMap);
       
    }
    
    
    else if (trigger.isAfter && trigger.isDelete){
        trgHandler1.trgMethod1(trigger.old, null);
        
    }
    
    else {
        trgHandler1.trgMethod1(trigger.new, null);
        
    }
}