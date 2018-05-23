import React from 'react';
import { StyleSheet, Text, View, Image, TouchableNativeFeedback, Button, ActivityIndicator, ScrollView, WebView } from 'react-native';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
//import { Icon } from 'react-native-elements'
import { COLOR, ThemeProvider, Toolbar, Card } from 'react-native-material-ui';
import StatusBar from "./StatusBar";
import ImageSlider from "react-native-image-slider";
import SplashScreen from 'react-native-splash-screen';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const userpic = require('./blue.png');

const uiTheme = {
  palette: {
    primaryColor: "#2A56C6"
  },
  toolbar: {
    container: {
      height: 50
    }
  }
};

var db2;

/*----------------------------------------------------------------------------------------------------------------------HOME SCREEN */
class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isLoading: true }
  }

  componentDidMount() {
    return fetch("https://evidenca.scv.si/trampolin/data.json")
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            isLoading: false,
            dataSource: responseJson
          },
          function() {}
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  static navigationOptions = ({navigation}) => {

    return{
      title: 'Ekipe',
      headerStyle: {
        backgroundColor: uiTheme.palette.primaryColor,
      },
      headerTitleStyle: {
        color: 'white'
      },
      headerLeft: (
        <TouchableNativeFeedback onPress={() => navigation.openDrawer()} background={TouchableNativeFeedback.Ripple('#ffffff', true)}>
            <View style={{padding: 5, margin: 15, marginLeft: 12}}>
              <Icon name="menu" size={24} color='white' />
            </View>
        </TouchableNativeFeedback>
      ),
      drawerLabel: 'Ekipe',
      drawerIcon: ( () => (<Icon name="person" size={24} />))
    }
  }

  render(){
    if(this.state.isLoading){
      return(
        <Text>Loading</Text>
      );
    } else {
      SplashScreen.hide();
      db2 = this.state.dataSource;
    return(
      <ThemeProvider uiTheme={uiTheme}>
        <View style={{ paddingTop: 0, backgroundColor: "white", height: "100%"}}>
            {
              this.state.dataSource.ekipe.map((teamInfo => (
              <View key={teamInfo.id}>
                <TouchableNativeFeedback
                  onPress={() => this.props.navigation.navigate('TeamInfo', {
                                                                              id: teamInfo.id,
                                                                              ime: teamInfo.ime,
                                                                              opis: teamInfo.opis,
                                                                              slika: teamInfo.slika,
                                                                              dod_slike: teamInfo.dod_slike,
                                                                              clani: teamInfo.clani
                  })}
                  background={TouchableNativeFeedback.SelectableBackground()}
                >
                  <View style={{ padding: 16, height: 96, borderBottomColor: "#E0E0E0", borderBottomWidth: 1}}>
                    <View style={{flex: 1, flexDirection: "row" }}>
                      <Image style={{ height: 64, width: 64, borderRadius: 50, resizeMode: 'contain'}} source={{ uri: teamInfo.slika }}/>
                      <View style={{ paddingLeft: 16, justifyContent: "center"}}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", opacity: 0.7 }}>{teamInfo.ime}</Text>
                        <Text style={{ fontSize: 14, opacity: 0.5, maxWidth: "90%", minWidth: "90%" }}>{teamInfo.kratek_opis}</Text>
                      </View>
                    </View>

                  </View>
                </TouchableNativeFeedback>
              </View>
            )))}
        </View>
      </ThemeProvider>
    )
  }
  }
}


/*------------------------------------------------------------------------------------------------------------ABOUT SCREEN */
class AboutScreen extends React.Component {
  /*static navigationOptions = {
    drawerLabel: 'O Programu',
    drawerIcon: ( () => (<Icon name="info" size={24} />))
  }*/

  static navigationOptions = ({ navigation }) => {

    return {
      title: 'O Programu',
      headerStyle: {
        backgroundColor: uiTheme.palette.primaryColor,
      },
      headerTitleStyle: {
        color: 'white'
      },
      headerLeft: (
        <TouchableNativeFeedback onPress={() => navigation.openDrawer()} background={TouchableNativeFeedback.Ripple('#ffffff', true)}>
          <View style={{ padding: 5, margin: 15, marginLeft: 12 }}>
            <Icon name="menu" size={24} color='white' />
          </View>
        </TouchableNativeFeedback>
      ),
      drawerLabel: 'O Programu',
      drawerIcon: (() => (<Icon name="info" size={24} />))
    }
  }

  render(){
    return(
      <ThemeProvider uiTheme={uiTheme}>
        <View>
          {/*<StatusBar backgroundColor={uiTheme.palette.primaryColor} barStyle="light-content"/>*/}
          <Toolbar leftElement="menu" onLeftElementPress={() => this.props.navigation.openDrawer()} centerElement="O Programu" />
          <Card>
            <Text style={{padding:10}}>Naredil: Alen Budimir</Text>
          </Card>
        </View>
      </ThemeProvider>
    );
  }
}

class VoteScreen extends React.Component {
  /*static navigationOptions = {
    drawerLabel: 'Glasuj',
    drawerIcon: (() => (<Icon name="info" size={24} />))
  }*/

  static navigationOptions = ({ navigation }) => {

    return {
      title: 'Glasuj',
      headerStyle: {
        backgroundColor: uiTheme.palette.primaryColor,
      },
      headerTitleStyle: {
        color: 'white'
      },
      headerLeft: (
        <TouchableNativeFeedback onPress={() => navigation.openDrawer()} background={TouchableNativeFeedback.Ripple('#ffffff', true)}>
          <View style={{ padding: 5, margin: 15, marginLeft: 12 }}>
            <Icon name="menu" size={24} color='white' />
          </View>
        </TouchableNativeFeedback>
      ),
      drawerLabel: 'Glasuj',
      drawerIcon: (() => (<Icon name="person" size={24} />))
    }
  }

  render() {
    return (
      <ThemeProvider uiTheme={uiTheme}>
        <View style={{ flex: 1 }}>
          {/*<StatusBar backgroundColor={uiTheme.palette.primaryColor} barStyle="light-content" />*/}
          <Toolbar leftElement="menu" onLeftElementPress={() => this.props.navigation.openDrawer()} centerElement="Glasuj" />
          <WebView
            source={{ uri: db2.slido }}
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            startInLoadingState={true}
          />
        </View>
      </ThemeProvider>
    );
  }
}

/*------------------------------------------------------------------------------------------------------------TEAM SCREEN */
class TeamInfoScreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    const { params } = navigation.state;

    return{
      title: params ? 'Ekipa ' + params.ime : 'Ekipa',
      headerStyle: {
        backgroundColor: uiTheme.palette.primaryColor,
      },
      headerTitleStyle: {
        color: 'white'
      },
      headerLeft: (
        <TouchableNativeFeedback onPress={() => navigation.goBack()} background={TouchableNativeFeedback.Ripple('#ffffff', true)}>
            <View style={{padding: 5, margin: 15, marginLeft: 12}}>
              <Icon name="arrow-back" size={24} color='white' />
            </View>
        </TouchableNativeFeedback>
      )
    }
  }

  render(){
    
    const { params } = this.props.navigation.state;
    const id = params ? params.id : null;
    const ime = params ? params.ime : null;
    const opis = params ? params.opis : null;
    const slika = params ? params.slika : null;
    const dod_slike = params ? params.dod_slike : null;
    const clani = params ? params.clani : null;
    
    return (
    <ScrollView>
      <ThemeProvider uiTheme={uiTheme}>
          <View style={{ padding: 16, backgroundColor: "white", height: "100%" }}>
            <View style={{ flex: 1, flexDirection: "row", maxHeight: 128, alignItems: "center" }}>
              <Image style={{ marginRight: 8, height: 128, width: 128, borderRadius: 100, resizeMode: 'contain' }} source={{ uri: slika }} />
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                {JSON.parse(JSON.stringify(ime))}
              </Text>
            </View>

            {/* Opis */}
            <View style={{ paddingTop: 10, paddingBottom: 16, borderBottomColor: "#E0E0E0", borderBottomWidth: 1 }}>
              <Text style={{ opacity: 0.5 }}>
                {JSON.parse(JSON.stringify(opis))}
              </Text>
            </View>

            <View style={{flex: 1}}>
              <ImageSlider style={{width: "100%"}} images={[
                'https://placeimg.com/640/640/nature',
                'https://placeimg.com/640/640/people',
                'https://placeimg.com/640/640/animals'
              ]}/>
            </View>

            {/* Člani */}
            <View style={{ paddingTop: 16}}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>Člani</Text>
              {clani.map(clan => <View key={clan.ime}>
                  <TouchableNativeFeedback onPress={() => this.props.navigation.navigate(
                        "UserInfo",
                        {
                          ime: clan.ime,
                          priimek: clan.priimek,
                          slika: clan.slika
                        }
                      )} background={TouchableNativeFeedback.SelectableBackground()}>
                    <View style={{ padding: 16, height: 96, borderBottomColor: "#E0E0E0", borderBottomWidth: 1 }}>
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <Image style={{ height: 64, width: 64, borderRadius: 50 }} source={{ uri: clan.slika}} />
                        <View style={{ paddingLeft: 16, justifyContent: "center" }}>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "bold",
                              opacity: 0.7
                            }}
                          >
                            {clan.ime}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableNativeFeedback>
                </View>)}
            </View>
          </View>
        </ThemeProvider>
      </ScrollView>
    );
  }
}


/*------------------------------------------------------------------------------------------------------------USER SCREEN */
class UserInfoScreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    const { params } = navigation.state;

    return{
      title: params ? params.ime : 'Član',
      headerStyle: {
        backgroundColor: uiTheme.palette.primaryColor,
      },
      headerTitleStyle: {
        color: 'white'
      },
      headerLeft: (
        <TouchableNativeFeedback onPress={() => navigation.goBack()} background={TouchableNativeFeedback.Ripple('#ffffff', true)}>
            <View style={{padding: 5, margin: 15, marginLeft: 12}}>
              <Icon name="arrow-back" size={24} color='white' />
            </View>
        </TouchableNativeFeedback>
      )
    }
  }

  render(){
    
    const { params } = this.props.navigation.state;
    const ime = params ? params.ime : null;
    const priimek = params ? params.priimek : null;
    const slika = params ? params.slika : null;
    
    return(
      <ThemeProvider uiTheme={uiTheme}>
        <View>
          <Card>
            <View style={[styles.cardInner, styles.height2]}>
              <View style={{ flex: 1, flexDirection: "row", maxHeight: 128, alignItems: 'center'}}>
                <Image style={{marginRight: 8, height: 128, width: 128, borderRadius: 50 }} source={{uri: slika}} />
                  <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                    {JSON.parse(JSON.stringify(ime)) + ' ' + JSON.parse(JSON.stringify(priimek)) }
                  </Text>
              </View>

              <View style={{paddingTop: 10}}>
                  <Text style={{ opacity: 0.5 }}>
                    {JSON.parse(JSON.stringify(priimek))}
                  </Text>
              </View>
            </View>
          </Card>
        </View>
      </ThemeProvider>
    );
  }
}


const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },

  cardInner: {
    padding: 10
  },

  height: {
    height: 300
  },
  height2: {
    height: '100%'
  }
})

const StackNav = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  TeamInfo: {
    screen: TeamInfoScreen,
  },
  UserInfo: {
    screen: UserInfoScreen,
  },
}, 
{
  initialRouteName: 'Home',
})

const RootStack = createDrawerNavigator({
  Home: {
    screen: StackNav,
  },
  About: {
    screen: AboutScreen,
  },
  Vote: {
    screen: VoteScreen,
  }
})

export default class App extends React.Component {

  render(){
      return (
        <RootStack />
      );
  }
}