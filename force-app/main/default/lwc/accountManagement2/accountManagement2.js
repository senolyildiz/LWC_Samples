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
        { label: 'Account Name', fieldName: 'Name', editable: true },
        { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true },
        { label: 'Account Type', fieldName: 'Type', editable: true },
        { label: 'Industry', fieldName: 'Industry', editable: true }
    ];

    @track draftValues = [];
    @track typeOptions = [];
    @track industryOptions = [];
    @track accounts = [];
    @track selectedAccounts = [];
    @track newAccount = {
        Name: '',
        Industry: '',
        Phone: '',
        Type: ''
    };
    @track updatedFields = {};
    @track selectedAction = ''; // Default to 'Create'
    @track isCreate = false;
    @track isUpdate = false;
    @track recordTypeId = ''; // Store the selected Record Type ID

    doctorRecordTypeId = '012WU0000022f17YAA';  // Doctor Record Type ID
    patientRecordTypeId = '012WU0000022eEjYAI';  // Patient Record Type ID
    accountsResult;

    actionOptions = [
        { label: 'Create an Account', value: 'create' },
        { label: 'Update Account', value: 'update' }
    ];

    recordTypeOptions = [
        { label: 'Patient', value: 'Patient' },
        { label: 'Doctor', value: 'Doctor' }
    ];

    // Fetch accounts via @wire
    @wire(getAccounts)
    wiredAccounts(result) {
        this.accountsResult = result;
        if (result.data) {
            this.accounts = result.data;
        } else if (result.error) {
            this.showToast('Error', result.error.body.message, 'error');
        }
    }

    // Fetch picklist values for Industry and Type
    @wire(getPicklistValuesByRecordType, { objectApiName: ACCOUNT_OBJECT, recordTypeId: '$recordTypeId' })
    wiredPicklistValues({ error, data }) {
        if (data) {
            this.industryOptions = data.picklistFieldValues.Industry.values;
            this.typeOptions = data.picklistFieldValues.Type.values;
        } else if (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }

    // Handle radio button change for Record Type selection
    handleRecordTypeChange(event) {
        const selectedRecordType = event.detail.value;
        if (selectedRecordType === 'Doctor') {
            this.recordTypeId = this.doctorRecordTypeId;
        } else if (selectedRecordType === 'Patient') {
            this.recordTypeId = this.patientRecordTypeId;
        }
    }

    // Handle action (Create or Update)
    handleActionChange(event) {
        this.selectedAction = event.detail.value;
        this.isCreate = this.selectedAction === 'create';
        this.isUpdate = this.selectedAction === 'update';
    }

    // Handle form inputs for both create and update forms
    handleInputs(event) {
        const field = event.target.name;
        if (this.isCreate) {
            this.newAccount[field] = event.target.value;
        } else if (this.isUpdate) {
            this.updatedFields[field] = event.target.value;
        }
    }

    // Handle creating a new account
    handleClickSave() {
        if (!this.recordTypeId) {
            this.showToast('Error', 'Please select a Record Type', 'error');
            return;
        }
    
        // Include RecordTypeId in the new account data
        const accountData = { ...this.newAccount, RecordTypeId: this.recordTypeId };
        
        console.log('Account Data being passed:', JSON.stringify(accountData)); // Debugging step
        
        createAccount({ acc: accountData })
            .then(() => {
                this.showToast('Success', 'Account created successfully', 'success');
                this.isCreate = false; // Hide the form after saving
                return refreshApex(this.accountsResult); // Refresh the account list
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }
    

    // Handle updating selected accounts
    handleClickUpdate() {
        if (this.selectedAccounts.length > 0 && Object.keys(this.updatedFields).length > 0) {
            const updatedAccountList = this.selectedAccounts.map(account => {
                let updatedAccount = { ...account };
                for (let field in this.updatedFields) {
                    updatedAccount[field] = this.updatedFields[field];
                }
                return updatedAccount;
            });

            updateAccount({ updatedAccountList })
                .then(() => {
                    this.showToast('Success', 'Accounts updated successfully', 'success');
                    this.isUpdate = false;
                    return refreshApex(this.accountsResult); // Refresh the datatable
                })
                .catch(error => {
                    this.showToast('Error', error.body.message, 'error');
                });
        } else {
            this.showToast('Error', 'No accounts selected or no fields to update', 'error');
        }
    }

    // Handle row selection for datatable
    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        this.selectedAccounts = [...selectedRows];
    }

    // Show toast notifications
    showToast(title, message, variant, mode = 'dismissable') {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
            mode
        });
        this.dispatchEvent(event);
    }
}
