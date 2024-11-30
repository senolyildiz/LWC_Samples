public with sharing class WeatherAPIController {
  @AuraEnabled
  public static string getWeatherData(String cityName) {
    system.debug('city'+ cityName);
    Http http= new Http();
    HttpRequest request= new HttpRequest();
    request.setMethod('GET');
    request.setEndpoint('callout:WeatherLWCAPINamed/current.json?q='+cityName);
    HttpResponse response= http.send(request);
    system.debug('code'+ response.getStatusCode());
    return response.getBody();

}
}
