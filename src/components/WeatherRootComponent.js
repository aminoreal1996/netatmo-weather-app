import React from 'react';
import SidebarComponent from './sidebar/SidebarComponent';
import HeaderComponent from './header/HeaderComponent';
import ContentComponent from './Content/ContentComponent';
import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import axios from 'axios';
import LogoLoading from '../assets/logoLoading.gif';

const styles = StyleSheet.create({
    container: {
        height: '100%',
        minHeight: '100vh'
    },
    content: {
        marginTop: 54
    },
    mainBlock: {
        backgroundColor: '#F7F8FC',
        padding: 30
    }
});

class WeatherRootComponent extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        access_token   : '',
        selectedItem   : 'Paris',
        villes         : {
                            "Paris" : {lat_ne : 48.86471476180278, lat_sw : 48.83579746243092, lon_ne : 2.373046875, lon_sw : 2.3291015625},
                            "New York" : {lat_ne : 40.97989806962013, lat_sw : 38.82259097617712, lon_ne : -81.5625, lon_sw : -81.5625},
                            "Berlin" : {lat_ne : 52.3755991766591, lat_sw : 52.26815737376817, lon_ne : 13.7109375, lon_sw : 13.53515625},
                            "Bogota" : {lat_ne : 5.266007882805492, lat_sw : 4.915832801313174, lon_ne : -75.234375, lon_sw : -75.5859375},
        },
        weatherData : {
          city       : '',
          globalInfo : {},
          temp       : {},
          press      : '',
          rain       : {},
          wind       : {},
        },
        showComponents : false,
        showLogoLoading : false,
        showError : 0,
      }
      this.handleOnChange = this.handleOnChange.bind(this)
      this.getAccessToken = this.getAccessToken.bind(this)
      this.getErrorComponent = this.getErrorComponent.bind(this)
    }

    async componentDidMount() {
        await this.getAccessToken()
        await this.handleOnChange(this.state.selectedItem)
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    async getAccessToken(){
      var myUrl = 'https://api.netatmo.com/oauth2/token';
      var form = new FormData();
      form.append("grant_type", "password");
      form.append("client_id", "5de510cde0c2b13b42637224");
      form.append("client_secret", "C5MVVhs3ARk1CO73qH3ClREBJuQJ7Cc4nmN6");
      form.append("scope", "read_station");
      form.append("username", "mohamedamine.elmoudni@gmail.com");
      form.append("password", "real-MADRID2010");
      await axios.post(myUrl, form, {})
      .then((res) => {
            this.setState({ access_token : res.data.access_token})
      })
      .catch(function (error) {
        this.setState({showError : 4, showLogoLoading : false})
        return;
      });
    }
    async handleOnChange(selectedItem){
        
      await this.setState({showComponents : false, showLogoLoading : true,showError : false})
      let dataJson;
      await this.setState({ selectedItem : selectedItem })

      const cityData = this.state.villes[selectedItem];
  
      const request = "https://api.netatmo.com/api/getpublicdata?lat_ne="+cityData.lat_ne+"&lat_sw="+cityData.lat_sw+"&lon_ne="+cityData.lon_ne+"&lon_sw="+cityData.lon_sw+"";
      console.log(request)
      
      await axios.get(request, { headers: {'Content-Type': 'application/json','Authorization' : 'Bearer '+this.state.access_token}})
        .then(response => {  
            dataJson = response
        })
        .catch((error) =>{
            this.setState({showError : 1, showLogoLoading : false})
            return;
        })
        if(dataJson == undefined){
            await this.setState({showError : 1, showLogoLoading : false})
            return;
        }else{
            if( dataJson.data.body.length <= 0 ) {
                await this.setState({showError : 3, showLogoLoading : false})
                return;
            }
            else{

                //Récupération de la location
                const locationCity = {
                    "longitude" : '',
                    "latitude" : '',
                }
                const globalInfoStruct = {
                    "location"   : [],
                    "timezone"     : '',
                    "country"    : '',
                    "altitude" : '',
                    "street" : '',
                }
                locationCity.longitude    = dataJson.data.body[0]["place"].location[0]
                locationCity.latitude     = dataJson.data.body[0]["place"].location[1]
                globalInfoStruct.location = locationCity
                globalInfoStruct.timezone = dataJson.data.body[0]["place"].timezone
                globalInfoStruct.country  = dataJson.data.body[0]["place"].country
                globalInfoStruct.altitude = dataJson.data.body[0]["place"].altitude
                globalInfoStruct.street   = dataJson.data.body[0]["place"].street
                


                //Récupération des adresse : mac_address_NAMain, NAModule1, NAModule2, NAModule3, NAModule4
                const mac_address_NAMain = dataJson.data.body[0]["_id"] // Pour récupérer la pression
                let NAModules = {
                    mac_address_NAModule1 : '',
                    mac_address_NAModule2 : '',
                    mac_address_NAModule3 : ''
                }
                    
                const module_types = dataJson.data.body[0].module_types //Pour récupérer la température et l'humidité
                const num = Object.keys(NAModules).length;
                for(const mac_address_NAModule in module_types){
                    const mac_address_NAModule_str = mac_address_NAModule.toString()
                    if(module_types[mac_address_NAModule_str] == 'NAModule1') NAModules.mac_address_NAModule1 = mac_address_NAModule_str
                    if(module_types[mac_address_NAModule_str] == 'NAModule2') NAModules.mac_address_NAModule2 = mac_address_NAModule_str
                    if(module_types[mac_address_NAModule_str] == 'NAModule3') NAModules.mac_address_NAModule3 = mac_address_NAModule_str
                }
                
                let time_stamp_press;
                const res_press = dataJson.data.body[0].measures[mac_address_NAMain.toString()].res
                for(const prop in res_press){
                    time_stamp_press = prop
                    break;
                }
                const press = dataJson.data.body[0].measures[mac_address_NAMain.toString()].res[time_stamp_press.toString()][0]
                
                // Récupération de la temperature et l'humidite
                // Cas 1 : Rain

                const rainStruct = {
                    "rain_60min"   : '',
                    "rain_24h"     : '',
                    "rain_live"    : '',
                    "rain_timeutc" : ''
                }

                if(NAModules.mac_address_NAModule3 != ''){
                    const rain_60min = dataJson.data.body[0].measures[NAModules.mac_address_NAModule3]["rain_60min"]
                    const rain_24h = dataJson.data.body[0].measures[NAModules.mac_address_NAModule3]["rain_24h"]
                    const rain_live = dataJson.data.body[0].measures[NAModules.mac_address_NAModule3]["rain_live"]
                    const rain_timeutc = dataJson.data.body[0].measures[NAModules.mac_address_NAModule3]["rain_timeutc"]

                    rain_60min   == null ? rainStruct.rain_60min   = "" : rainStruct.rain_60min   = rain_60min
                    rain_24h     == null ? rainStruct.rain_24h     = "" : rainStruct.rain_24h     = rain_24h
                    rain_live    == null ? rainStruct.rain_live    = "" : rainStruct.rain_live    = rain_live
                    rain_timeutc == null ? rainStruct.rain_timeutc = "" : rainStruct.rain_timeutc = rain_timeutc
                    
                }

                //Cas 2 : Wind

                const windStruct = {
                        "wind_strength" : '',
                        "wind_angle"    : '',
                        "gust_strength" : '',
                        "gust_angle"    : '',
                        "wind_timeutc"  : ''
                }

                if(NAModules.mac_address_NAModule2 != ''){
                    const wind_strength = dataJson.data.body[0].measures[NAModules.mac_address_NAModule2]["wind_strength"]
                    const wind_angle = dataJson.data.body[0].measures[NAModules.mac_address_NAModule2]["wind_angle"]
                    const gust_strength = dataJson.data.body[0].measures[NAModules.mac_address_NAModule2]["gust_strength"]
                    const gust_angle = dataJson.data.body[0].measures[NAModules.mac_address_NAModule2]["gust_angle"]
                    const wind_timeutc = dataJson.data.body[0].measures[NAModules.mac_address_NAModule2]["wind_timeutc"]

                        windStruct.wind_strength = wind_strength
                        windStruct.wind_angle    = wind_angle
                        windStruct.gust_strength = gust_strength
                        windStruct.gust_angle    = gust_angle
                        windStruct.wind_timeutc  = wind_timeutc

                }
                        
                //Cas 3 : Temperatue
                const res_temp = dataJson.data.body[0].measures[NAModules.mac_address_NAModule1].res
                let time_stamp_temp_hum;
                for(const prop in res_temp){
                    time_stamp_temp_hum = prop
                    break;
                }
                const temperature = dataJson.data.body[0].measures[NAModules.mac_address_NAModule1].res[time_stamp_temp_hum.toString()][0]
                const humidite = dataJson.data.body[0].measures[NAModules.mac_address_NAModule1].res[time_stamp_temp_hum.toString()][1]

                const temperatureStruct = {
                    "temperature" : temperature,
                    "humidite" : humidite
                }

                await this.setState({
                    weatherData : {
                        city : selectedItem,
                        globalInfo : globalInfoStruct,
                        temp : temperatureStruct,
                        rain: rainStruct,
                        wind : windStruct,
                        press : press,
                    },
                })
                await this.setState({showComponents : true, showLogoLoading : false})
                this.getComponent();
            }    
        }
    }

    getComponent(){
      const data = this.state.weatherData
      return <ContentComponent weatherData = {data} />
    }
    getErrorComponent(numError){
        switch(numError) {
            case 1:
                return (
                    <div>
                        <h3>Server error </h3>
                        <h6> Try later please</h6>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h3>Data not found </h3>
                        <h6> Try later please </h6>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h3>Data not found </h3>
                        <h6> Try later please </h6>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <h3>Please refresh your page </h3>
                    </div>
                );
            default:
                return (
                    <div>
                        <h3>Error not found </h3>
                        <h6> Try later please</h6>
                    </div>
                );
          }
        
    }
    getLogoLoading(){
        return (
            <div>
                <img style={{textAlign : "center "}} src={LogoLoading} alt="loading..." />
            </div>
        );
    }

    resize = () => this.forceUpdate();

    render() {
        const { selectedItem } = this.state;
        return (
            <Row className={css(styles.container)}>
              <SidebarComponent onChange={this.handleOnChange} />
                <Column flexGrow={1} className={css(styles.mainBlock)}>
                  <HeaderComponent title={selectedItem} />
                    <div className={css(styles.content)}>
                      {this.state.showComponents ? this.getComponent() : null }
                      {this.state.showError != 0 ? this.getErrorComponent(this.state.showError) : null }
                      {this.state.showLogoLoading ? this.getLogoLoading() : null }
                      
                    </div>
                </Column>

              
            </Row>
        );
    }
}

export default WeatherRootComponent;
