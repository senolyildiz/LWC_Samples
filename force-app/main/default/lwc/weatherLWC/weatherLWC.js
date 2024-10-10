import { LightningElement } from 'lwc';
import  getWeatherData from '@salesforce/apex/WeatherAPIController.getWeatherData';
export default class WeatherLWC extends LightningElement {

   // weatherData={};
    cityName= '';
    handleChange(event){
        this.cityName=event.target.value;
       }
       handleClickSave(){
        getWeatherData({cityName:this.cityName})
        .then(result=>{
            let weatherdata=JSON.parse(result);
            console.log(JSON.stringify(weatherData, null, 2));
        })
        .catch(error=>{
            this.showToast('Error', error.body.message, 'error');
}}}
