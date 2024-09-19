import { LightningElement, api, track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class LDSRecordForm extends LightningElement {
    fields = ['Name', 'Phone', 'Industry', 'Type'];
    @api recordId;
    showForm= false;

    handleSuccess(event){
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        inputFields.forEach( field => {
            field.reset();
        });
        const editForm = this.template.querySelector('lightning-record-form');
        editForm.recordId = null;
        
        const evt = new ShowToastEvent({
            title: "Woov",
            message: "An account was successfully created",
            variant: "success"
        });
        
        this.dispatchEvent(evt);
    }

    handleToggle (){
        this.showForm = !this.showForm;
    }

}