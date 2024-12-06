trigger account on Account (after update) {
    if (Trigger.isAfter && Trigger.isUpdate) {
        trgHandler2.trgMethod2(Trigger.new, Trigger.oldMap);
    }
}
