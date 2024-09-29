import { LightningElement, track, wire } from 'lwc';
import getTypePicklistValues from '@salesforce/apex/AccountManagementController.getTypePicklistValues';
import { getPicklistValuesByRecordType } from "lightning/uiObjectInfoApi";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import createAccount from '@salesforce/apex/AccountManagementController.createAccount';
import updateAccount from '@salesforce/apex/AccountManagementController.updateAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccounts from '@salesforce/apex/AccountManagementController.getAccounts';
import { refreshApex } from '@salesforce/apex';

export default class AccountManagement extends LightningElement {
    columns = [
        { label: 'Account Name', fieldName: 'Name', editable: true},
        { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true },
        { label: 'Account Type', fieldName: 'Type', type: 'Picklist' , editable: true},
        { label: 'Account Industry', fieldName: 'Industry', type: 'Picklist', editable: true },
    ];
    @track typeOptions = [];
    @track industryOptions = [];
    showCreateForm= false;
    showUpdateForm= false;
    @track accountsResult=[];
    @track accounts=[];
    @track selectedAccounts=[];
    @track updatedFields={};
    @track  newAccount = {
        Name: '',
        Industry: '',
        Phone: '',
        Type: ''
    };
    selectedAccountIds;

    
       
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

         @wire(getAccounts)
         wiredAccounts(result) {
            this.accountsResult=result;
             if (result.data) {
                 this.accounts=result.data;
            } else if (result.error) {
                  this.showToast('Error', error.body.message, 'error');
              }}

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
       if(this.showCreateForm){
        this.newAccount[field]=event.target.value;
        console.log('New Account: ' + JSON.stringify(this.newAccount, null, 2)); 
       }
       else if(this.showUpdateForm){
        this.updatedFields[field]=event.target.value;
        console.log('updatedFields: ' + JSON.stringify(this.updatedFields, null, 2)); 
       }
        
    }

    handleClickSave(){
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

    handleToggle(event){
        if (event.target.label=="Update Account" ) {
            this.showUpdateForm= !this.showUpdateForm;
        }else{

        this.showCreateForm= !this.showCreateForm;}
    }
    handleCheckboxChange(event){
        const selectedId = event.target.value;
        const selectedAccount = this.accounts.find(account => account.Id === selectedId);

        if (event.target.checked) {
            this.selectedAccounts = [...this.selectedAccounts, selectedAccount];
        } else {
            this.selectedAccounts = this.selectedAccounts.filter(account => account.Id !== selectedId);
        }
        console.log(JSON.stringify(this.selectedAccounts, null, 2));
            
    }
    handleClickUpdate(){
        if (this.selectedAccounts.length > 0 && Object.keys(this.updatedFields).length > 0) {
            this.selectedAccounts = this.selectedAccounts.map(account => {
                let updatedAccount = { ...account };
                for (let field in this.updatedFields) {
                    updatedAccount[field] = this.updatedFields[field];
                    console.log('mergg:', JSON.stringify(updatedAccount, null, 2));
                }
                return updatedAccount;
                
            });
    
        updateAccount({ updatedAccountList: this.selectedAccounts })
                .then(() => {
                    this.showToast('Success', 'Accounts updated successfully', 'success');
                    //this.showUpdateForm = false;
                      this.selectedAccountIds=[];
                    return refreshApex(this.accountsResult);
                })
                .catch(error => {
                    this.showToast('Error', error.body.message, 'error');
                });
        
}
else {
            this.showToast('Error', 'No accounts selected or no fields to update', 'error');
        }
    }
    handleRowSelection (event){
        //Get the selected rows (accounts)
        const selectedRows = event.detail.selectedRows;

        // Update the selectedAccounts variable
        this.selectedAccounts = [...selectedRows];
        console.log('datatable:', JSON.stringify(this.selectedAccounts, null, 2));
        
    }


    handleSave(event) {
        const updatedFields = event.detail.draftValues;
        if (!updatedFields || updatedFields.length === 0) {
            this.showToast('Error', 'No changes detected', 'error');
            return;
        }
    
        updateAccount({ updatedAccountList: updatedFields })
            .then(() => {
                this.showToast('Success', 'Accounts updated successfully', 'success');
                // Clear draft values
                this.draftValues = [];
                return refreshApex(this.accountsResult);
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }   

}
