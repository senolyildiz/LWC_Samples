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
    accountsResult;

    actionOptions = [
        { label: 'Create an Account', value: 'create' },
        { label: 'Update Account', value: 'update' }
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
    @wire(getPicklistValuesByRecordType, {
        objectApiName: ACCOUNT_OBJECT,
        recordTypeId: "012000000000000AAA" // Replace with correct Record Type Id
    })
    wiredPicklistValues({ error, data }) {
        if (data) {
            this.industryOptions = data.picklistFieldValues.Industry.values;
            this.typeOptions = data.picklistFieldValues.Type.values;
        } else if (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }

    // Handle radio button change
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
        createAccount({ acc: this.newAccount })
            .then(() => {
                this.showToast('Success', 'Account created successfully', 'success');
                this.isCreate = false; // Hide the form after saving
                return refreshApex(this.accountsResult); // Refresh the account list
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    // Handle checkbox change to select/deselect accounts
    handleCheckboxChange(event) {
        const selectedId = event.target.value;
        const selectedAccount = this.accounts.find(account => account.Id === selectedId);

        if (event.target.checked) {
            this.selectedAccounts = [...this.selectedAccounts, selectedAccount];
        } else {
            this.selectedAccounts = this.selectedAccounts.filter(account => account.Id !== selectedId);
        }
    }

    // Handle updating selected accounts
    handleClickUpdate() {
        if (this.selectedAccounts.length > 0 && Object.keys(this.updatedFields).length > 0) {
            const updatedAccountList = this.selectedAccounts.map(account => {
                let updatedAccount = { ...account }; // Copy the original account
                for (let field in this.updatedFields) {
                    updatedAccount[field] = this.updatedFields[field]; // Apply the updates
                }
                return updatedAccount;
            });

            updateAccount({ updatedAccountList })
                .then(() => {
                    this.showToast('Success', 'Accounts updated successfully', 'success');
                    this.isUpdate = false; // Hide the form after updating
                    return refreshApex(this.accountsResult); // Refresh the account list
                })
                .catch(error => {
                    this.showToast('Error', error.body.message, 'error');
                });
        } else {
            this.showToast('Error', 'No accounts selected or no fields to update', 'error');
        }
    }

    // Show toast notifications
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(event);
    }
}
