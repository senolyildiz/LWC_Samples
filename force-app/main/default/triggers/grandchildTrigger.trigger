trigger grandchildTrigger on OpportunityLineItem (after insert, after delete) {
if (Trigger.isAfter&&Trigger.IsInsert)
{
    trgHandler3.trgMethod3(Trigger.new);
}
if (Trigger.isAfter&&Trigger.IsDelete){
    trgHandler3.trgMethod3(Trigger.old);
}
   
}