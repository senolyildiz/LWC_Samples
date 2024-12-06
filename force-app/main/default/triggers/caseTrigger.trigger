trigger caseTrigger on Case (after insert, after update, after delete, after undelete) {
if (Trigger.isAfter&&Trigger.isUpdate){
    trgHandler4.trgMethod4(trigger.new, trigger.oldMap);
}
else if (Trigger.isAfter&&Trigger.isUndelete){
    trgHandler4.trgMethod4(trigger.new, null);
}
else if(Trigger.isAfter&&Trigger.isDelete){
            trgHandler4.trgMethod4(trigger.old, null);
}
}