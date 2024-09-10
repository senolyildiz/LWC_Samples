import { LightningElement, wire } from 'lwc';
import getTypePicklistValues from '@salesforce/apex/AccountManagementController.getTypePicklistValues';
import { getPicklistValuesByRecordType } from "lightning/uiObjectInfoApi";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import createAccount from '@salesforce/apex/AccountManagementController.createAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class AccountManagement extends LightningElement {
    typeOptions = [];
    industryOptions = [];
    showForm= false;

    newAccount = {
        Name: '',
        Industry: '',
        Phone: '',
        Type: ''
    };

    
       
  /*  @wire(getTypePicklistValues)
    wiredTypePicklistValues(result) {
        if (result.data) {
            console.log('data: '+JSON.stringify(data));
            this.typeOptions=data;
            console.log(JSON.stringify(this.typeOptions, null, 2)); 
         } else if (result.error) {
             this.showToast('Error', error.body.message, 'error');
         }
     }*/

       @wire(getPicklistValuesByRecordType, {
        objectApiName: ACCOUNT_OBJECT,
        recordTypeId: "012000000000000AAA" // Yerine uygun Record Type Id'sini koyun
    })
    wiredIndustryPicklistValues({ error, data }) {
        if (data) {
            // Picklist alanlarının tümünü döndürür
            this.industryOptions = data.picklistFieldValues.Industry.values;
            this.typeOptions = data.picklistFieldValues.Type.values
            console.log('Industry picklist values: ' + JSON.stringify(this.industryOptions, null, 2)); 
        } else if (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }
    handleInputs(event) {
       const field= event.target.name;
        this.newAccount[field]=event.target.value;
        console.log('New Account: ' + JSON.stringify(this.newAccount, null, 2)); 
    }

    handleClick(){
        createAccount({acc:this.newAccount})
            .then(() => {
                this.showToast('Congrats', 'Account created successfuly', 'info', 'sticky');
                this.showForm=false;
            })
            .catch((error) => {
                
            });
    }

   showToast(title, message, variant, mode) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode:mode,
        });
        this.dispatchEvent(event);
    }

    handleToggle(){
        this.showForm= !this.showForm;
    }
}


