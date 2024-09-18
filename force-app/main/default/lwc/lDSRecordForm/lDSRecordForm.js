import { LightningElement, api, track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class LDSRecordForm extends LightningElement {
    fields = ['Name', 'Phone', 'Industry', 'Type'];
    @api recordId;
<<<<<<< HEAD
    showForm= false;

    handleSuccess(event){
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        inputFields.forEach( field => {
            field.reset();
        });
        const editForm = this.template.querySelector('lightning-record-form');
        editForm.recordId = null;
        
=======

    handleSuccess(event){
>>>>>>> 90fdf5a63b28d880ef7308b9fd19ab467eba10ba
        const evt = new ShowToastEvent({
            title: "Woov",
            message: "An account was successfully created",
            variant: "success"
        });
        
<<<<<<< HEAD
        this.dispatchEvent(evt);
    }

    handleToggle (){
        this.showForm = !this.showForm;
    }
=======
       
        this.dispatchEvent(evt);
    }

>>>>>>> 90fdf5a63b28d880ef7308b9fd19ab467eba10ba

}