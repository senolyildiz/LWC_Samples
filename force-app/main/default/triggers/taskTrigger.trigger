trigger taskTrigger on Opportunity (after update) {
if(Trigger.isAfter&&Trigger.isUpdate){
    trgHandler5.trgMethod5(Trigger.new, Trigger.oldMap);
}
}