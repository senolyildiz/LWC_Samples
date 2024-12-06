import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class CreateContact extends LightningElement {

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
            message: "A Contact was successfully created",
            variant: "success"
        });
        
        this.dispatchEvent(evt);
    }

    handleToggle (){
        this.showForm = !this.showForm;
    }
    handleToggle (){
        this.showForm = !this.showForm;
    }

}