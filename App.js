import React from 'react';
import { StyleSheet, Text, View, Image, TouchableNativeFeedback, ActivityIndicator, ScrollView, WebView, Linking } from 'react-native';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLOR, ThemeProvider, Toolbar, Card, Button } from 'react-native-material-ui';
import Slideshow from 'react-native-slideshow';
import SplashScreen from 'react-native-splash-screen';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

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

    return {
      title: 'Teams',
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
      drawerLabel: 'Teams',
      drawerIcon: ( () => (<Icon name="person" size={24} />))
    }
  }

  render(){
    if(this.state.isLoading){
      return(
        <Text>Loading</Text>
      );
    } else {
      setTimeout(function () { SplashScreen.hide(); }, 2000);
      
      db2 = this.state.dataSource;
    return(
      <ThemeProvider uiTheme={uiTheme}>
        <ScrollView style={{ paddingTop: 0, backgroundColor: "white", height: "100%"}}>
            {
              this.state.dataSource.ekipe.map((teamInfo => (
              <View key={teamInfo.id}>
                <TouchableNativeFeedback
                  onPress={() => this.props.navigation.navigate('TeamInfo', {
                                                                              id: teamInfo.id,
                                                                              ime: teamInfo.ime,
                                                                              opis: teamInfo.opis,
                                                                              slika: teamInfo.slika,
                                                                              www: teamInfo.www,
                                                                              dod_slike: teamInfo.dod_slike,
                                                                              clani: teamInfo.clani
                  })}
                  background={TouchableNativeFeedback.SelectableBackground()}
                >
                  <View style={{ padding: 16, borderBottomColor: "#E0E0E0", borderBottomWidth: 1}}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                      <Image style={{ height: 64, width: 64, borderRadius: 50, resizeMode: 'contain'}} source={{ uri: teamInfo.slika }}/>
                      <View style={{ paddingLeft: 16, justifyContent: "center"}}>
                        <Text style={[styles.titleText, { fontSize: 18}]}>{teamInfo.ime}</Text>
                        <Text style={[styles.descText, { fontSize: 14, maxWidth: "90%", minWidth: "90%" }]}>{teamInfo.kratek_opis}</Text>
                      </View>
                    </View>

                  </View>
                </TouchableNativeFeedback>
              </View>
            )))}
        </ScrollView>
      </ThemeProvider>
    )
  }
  }
}

/*------------------------------------------------------------------------------------------------------------TEAM SCREEN */

class TeamInfoScreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    const { params } = navigation.state;

    return{
      title: params ? 'Team ' + params.ime : 'Team',
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
    const www = params ? params.www : null;
    
    /*var slideshow = [];
    for (var i = 0; i < dod_slike.length; i++) {
      slideshow[i] = dod_slike[i].url;
    }*/

    var slideshow = [];
    for (var i = 0; i < dod_slike.length; i++) {
      slideshow.push({"url": dod_slike[i].url});
    }

    return (
      <ThemeProvider uiTheme={uiTheme}>
          <ScrollView style={{ padding: 16, backgroundColor: "white", height: "100%" }}>
            <View style={{ flex: 1, flexDirection: "row", maxHeight: 128, alignItems: "center" }}>
              <Image style={{ marginRight: 8, height: 128, width: 128, borderRadius: 100, resizeMode: 'contain' }} source={{ uri: slika }} />
              <Text style={[styles.titleText, { paddingLeft: 6, fontSize: 24}]}>
                {JSON.parse(JSON.stringify(ime))}
              </Text>
            </View>

            <View>
              <Button primary text="Website" icon="language" onPress={() => Linking.openURL(www)}/>
            </View>

            <View style={{ flex: 1, borderTopColor: "#E0E0E0", borderTopWidth: 1, paddingTop: 16}}>
              {/*<ImageSlider images={slideshow} />*/}
              <Slideshow
                height={400}
                arrowSize={18}
                scrollEnabled={false}
                dataSource={slideshow} />
            </View>

            {/* Opis */}
            <View style={{ paddingTop: 10, paddingBottom: 16, borderBottomColor: "#E0E0E0", borderBottomWidth: 1 }}>
              <Text style={[styles.descText, { fontSize: 16 }]}>
                {JSON.parse(JSON.stringify(opis))}
              </Text>
            </View>



            {/* Člani */}
            <View style={{ paddingTop: 16, paddingBottom: 24}}>
              <Text style={[styles.titleText, { fontSize: 20}]}>Team Members</Text>
              {clani.map((clan, index) =>
                <View key={index}>
                  <TouchableNativeFeedback onPress={() => this.props.navigation.navigate(
                        "UserInfo",
                        {
                          ime: clan.ime,
                          priimek: clan.priimek,
                          slika: clan.slika,
                          email: clan.email,
                          phone: clan.phone,
                          linkedin: clan.linkedin,
                          opis: clan.opis
                        }
                      )} background={TouchableNativeFeedback.SelectableBackground()}>
                    <View style={{ padding: 16, height: 96, borderBottomColor: "#E0E0E0", borderBottomWidth: 1 }}>
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <Image style={{ height: 64, width: 64, borderRadius: 50 }} source={{ uri: clan.slika}} />
                        <View style={{ paddingLeft: 16, justifyContent: "center" }}>
                          <Text style={{ fontSize: 18, fontWeight: "bold", opacity: 0.8 }}>
                            {clan.ime}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              )}
            </View>
          </ScrollView>
        </ThemeProvider>
    );
  }
}

/*------------------------------------------------------------------------------------------------------------USER SCREEN */
class UserInfoScreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    const { params } = navigation.state;

    return{
      title: params ? params.ime : 'Member',
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
    const email = params ? params.email : null;
    const phone = params ? params.phone : null;
    const linkedin = params ? params.linkedin : null;
    const opis = params ? params.opis : null;
    
    return(
      <ThemeProvider uiTheme={uiTheme}>
        <View style={{ backgroundColor: "white" }}>
            <View style={[styles.height2, {padding: 16}]}>
              <View style={{ flex: 1, flexDirection: "row", maxHeight: 128, alignItems: 'center'}}>
                <Image style={{marginRight: 8, height: 128, width: 128, borderRadius: 100 }} source={{uri: slika}} />
                  <Text style={[styles.titleText, { fontSize: 24 }]}>
                    {JSON.parse(JSON.stringify(ime)) + ' ' + JSON.parse(JSON.stringify(priimek)) }
                  </Text>
              </View>

              <View style={{ paddingTop: 16, paddingBottom: 16, borderBottomColor: "#E0E0E0", borderBottomWidth: 1 }}>
                <Text style={[styles.descText, {fontSize: 16}]}>
                  {JSON.parse(JSON.stringify(opis))}
                </Text>
              </View>

              <View style={{ paddingTop: 16, paddingBottom: 16, borderBottomColor: "#E0E0E0", borderBottomWidth: 1, alignItems: "flex-start" }}>
                <Button primary text="Email" icon="mail" onPress={() => Linking.openURL("mailto:" + email)} />
                <Button primary text={JSON.parse(JSON.stringify(phone))} icon="phone" onPress={() => Linking.openURL("tel:" + phone)} />
                <Button primary text="Linkedin" icon="info" onPress={() => Linking.openURL(linkedin)} />
              </View>
            </View>
        </View>
      </ThemeProvider>
    );
  }
}

/*------------------------------------------------------------------------------------------------------------VOTE SCREEN */
class VoteScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {

    return {
      title: 'Vote',
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
      drawerLabel: 'Vote',
      drawerIcon: (() => (<Icon name="poll" size={24} />))
    }
  }

  render() {
    return (
      <ThemeProvider uiTheme={uiTheme}>
        <View style={{ flex: 1 }}>
          <Toolbar leftElement="menu" onLeftElementPress={() => this.props.navigation.openDrawer()} centerElement="Vote" />
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

/*------------------------------------------------------------------------------------------------------------ABOUT SCREEN */
class AboutScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {

    return {
      title: 'About',
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
      drawerLabel: 'About',
      drawerIcon: (() => (<Icon name="info" size={24} />))
    }
  }

  render(){
    return(
      <ThemeProvider uiTheme={uiTheme}>
        <View>
          <Toolbar leftElement="menu" onLeftElementPress={() => this.props.navigation.openDrawer()} centerElement="About" />
          <View style={{ padding: 16 }}>
            <View style={{ margin: "auto" }}>
              <Image style={{ height: 128, resizeMode: 'contain' }} source={{ uri: db2.oprogramuslika }} />
            </View>
            <Text style={{paddingTop: 16}}>{db2.oprogramu}</Text>
          </View>
        </View>
      </ThemeProvider>
    );
  }
}

/*------------------------------------------------------------------------------------------------------------Dev SCREEN */
class AppInfoScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {

    return {
      title: 'Application Info',
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
      drawerLabel: 'Application Info',
      drawerIcon: (() => (<Icon name="settings" size={24} />))
    }
  }

  render() {
    return (
      <ThemeProvider uiTheme={uiTheme}>
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Toolbar leftElement="menu" onLeftElementPress={() => this.props.navigation.openDrawer()} centerElement="Application Info" />
          <View style={{ padding: 16 }}>
            <Text style={[styles.titleText, { fontSize: 18 }]}>Developer: Alen Budimir</Text>
            <Button primary text="Email" icon="mail" onPress={() => Linking.openURL("mailto:alenab22@gmail.com")}/>
            <Button primary text="Github" icon="cloud" onPress={() => Linking.openURL("https://github.com/budi1200/trampolinapp")} />
          </View>
        </View>
      </ThemeProvider>
    );
  }
}

const styles = StyleSheet.create({
  height: {
    height: 300
  },
  height2: {
    height: '100%'
  },
  titleText: {
    color: "black",
    opacity: 0.6,
    fontWeight: "bold"
  },
  descText: {
    opacity: 0.9,
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
})

const RootStack = createDrawerNavigator(
  {
    Home: {
      screen: StackNav,
      navigationOptions: props => ({
        title: "Teams",
        drawerIcon: () => <Icon name="person" size={24} />
      })
    },
    Vote: {
      screen: VoteScreen
    },
    About: {
      screen: AboutScreen
    },
    AppInfo: {
      screen: AppInfoScreen
    }
  },
  {
    contentOptions: {
      activeTintColor: "#2b55c6"
    }
  }
);

export default class App extends React.Component {

  render(){
      return (
        <RootStack />
      );
  }
}