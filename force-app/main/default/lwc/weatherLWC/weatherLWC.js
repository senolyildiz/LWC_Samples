import { LightningElement } from 'lwc';
import  getWeatherData from '@salesforce/apex/WeatherAPIController.getWeatherData';
export default class WeatherLWC extends LightningElement {

   // weatherData={};
    cityName= '';
    weatherdata={};
    city;
    icon;
    temp;
    wind;
    wheathertext;

    handleChange(event){
        this.cityName=event.target.value;
        console.log('city'+ this.cityName);

       }
       handleClickSave(){
        getWeatherData({cityName:this.cityName})
        .then(result=>{
            this.weatherdata=JSON.parse(result);
            console.log('wheather'+JSON.stringify(this.weatherdata, null, 2));

            this.city=this.weatherdata.location.name;
            this.icon=this.weatherdata.current.condition.icon;
            this.temp=this.weatherdata.current.temp_c;
            this.wind=this.weatherdata.current.wind_kph;
            this.wheathertext=this.weatherdata.current.condition.text;
        })
        .catch(error=>{ });
}
}
