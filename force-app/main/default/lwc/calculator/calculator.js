import { LightningElement } from 'lwc';

export default class Calculator extends LightningElement {
    firstNumber;
    secondNumber;
    result;

    handleFirstNumber (event){
       // console.log('First Number is: ' + event.target.value );
        
        this.firstNumber = event.target.value;
    }

    handleSecondNumber (event){
        console.log('Second Number is: ' + event.target.value );
        this.secondNumber = event.target.value;
    }
    handleAdditionClick(){

        this.result = Number(this.firstNumber) + Number(this.secondNumber);
    }

    handleSubstractionClick(){

        this.result = this.firstNumber - this.secondNumber;
    }handleMultipliyingClick(){

        this.result = this.firstNumber * this.secondNumber;
    }handleDivisionClick(){
        if(this.secondNumber==0){
            alert("Can not divide by 0");
        }else{this.result = this.firstNumber / this.secondNumber;}
        
    }
    handleClick(event){
        switch (event.target.label) {
            case 'Add':
                this.result = Number(this.firstNumber) + Number(this.secondNumber);
                break;
            case 'Substract':
                this.result = this.firstNumber - this.secondNumber;
                break;
            case 'Multiply':
                this.result = this.firstNumber * this.secondNumber;
                break;
            default:
                if(this.secondNumber==0){
                    alert("Can not divide by 0");
                }else{this.result = this.firstNumber / this.secondNumber;}
        }
    }
}