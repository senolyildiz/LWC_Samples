public with sharing class WeatherAPIController {
  @AuraEnabled
  public static string getWeatherData(String cityName) {
    Http http= new Http();
    HttpRequest request= new HttpRequest();
    request.setMethod('GET');
    request.setEndpoint('callout:WeatherLWCAPINamed/current.json?q='+cityName);
    HttpResponse response= http.send(request);
    return response.getBody();
}
}
