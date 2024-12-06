public with sharing class trgHandler5 {
    public static void trgMethod5(List<Opportunity> oppList, Map<Id, Opportunity> oldMap) {

        Set<Id> oppIds = new Set<Id>();
        List<Task> listToUpdate = new List<Task>();
        List<Task> listToInsert = new List<Task>();

        // Step 1: Collect Opportunity IDs where StageName has changed
        if (!oppList.isEmpty()) {
            for (Opportunity newOpp : oppList) {
                Opportunity oldOpp = oldMap.get(newOpp.Id);

                // Check if StageName has changed
                if (newOpp.StageName != oldOpp.StageName) {
                    oppIds.add(newOpp.Id);
                }
            }
        }

        // Step 2: Query existing Tasks for these Opportunities
        if (!oppIds.isEmpty()) {
            List<Task> taskList = [SELECT Id, WhatId, Description FROM Task WHERE WhatId IN :oppIds];
            Map<Id, Task> taskMap = new Map<Id, Task>();

            // Map existing Tasks by Opportunity ID
            if (!taskList.isEmpty()) {
                for (Task tsk : taskList) {
                    taskMap.put(tsk.WhatId, tsk);
                }
            }

            // Step 3: Process each Opportunity
            for (Opportunity opp : oppList) {
                if (opp.StageName != oldMap.get(opp.Id).StageName) {
                    Task newTask;

                    // If Task exists, update it
                    if (taskMap.containsKey(opp.Id)) {
                        newTask = taskMap.get(opp.Id);
                        newTask.Description =' This opportunities stage updated as '  + opp.StageName +  ' please deal with it';
                        listToUpdate.add(newTask);

                    // Otherwise, create a new Task
                    } else {
                        newTask = new Task();
                        newTask.WhatId = opp.Id;
                        newTask.Description = ' Its stages has been updated as '+ opp.StageName + ' Please deal with this opportunity';
                        newTask.Subject = 'New Opp';
                        newTask.OwnerId = UserInfo.getUserId();
                        listToInsert.add(newTask);
                    }
                }
            }

            // Step 4: Perform bulk DML operations
            if (!listToUpdate.isEmpty()) {
                update listToUpdate;
            }
            if (!listToInsert.isEmpty()) {
                insert listToInsert;
            }
        }
    }
}
