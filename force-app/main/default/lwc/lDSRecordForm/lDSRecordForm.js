import { LightningElement, api, track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class LDSRecordForm extends LightningElement {
    fields = ['Name', 'Phone', 'Industry', 'Type'];
    @api recordId;

    handleSuccess(event){
        const evt = new ShowToastEvent({
            title: "Woov",
            message: "An account was successfully created",
            variant: "success"
        });
        
       
        this.dispatchEvent(evt);
    }


}