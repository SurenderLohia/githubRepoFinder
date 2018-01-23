/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Modal,
  Image
} from 'react-native';

import {
  View,
  Header, 
  Container,
  Content,
  Text,
  Item,
  Input,
  Icon,
  Button,
  Spinner,
  List,
  ListItem,
  Thumbnail,
  Card,
  CardItem,
  H3,
} from 'native-base';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      search: 'nativebase',
      selectedItem: undefined,
      modalVisible: false,
      data: []
    }
  }

  setModalVisible(visible, currentItem) {
    this.setState({
      modalVisible: visible,
      selectedItem: currentItem
    })
  }

  componentDidMount() {
    this.search();
  }

  
  async search() {
    this.setState({isLoading: true});

    return await fetch('https://api.github.com/search/repositories?q='+this.state.search)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          data: responseJson.items
        })
      })
      .catch((error) => {
        this.setState({
          isLoading: false
        });
        console.error(error);
      })
  }

  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search" value={this.state.search} onChangeText={(text) => this.setState({search: text})} onSubmitEditing={() => this.search()} />
            <Icon name="ios-arrow-forward" onPress={() => this.search()} />
          </Item>
        </Header>
        <Content>
        {this.renderContent()}
        {this.renderModal()}
        </Content>
      </Container>
    );
  }

  renderContent(){
    if(this.state.isLoading){
      return <Spinner />;
    } else {
      return (
        <List 
          dataArray={this.state.data}
          renderRow={(item) => this.renderListItem(item)}
          style={styles.nList}
        />
      );
    }    
  }

  renderListItem(item){
      return (
        <ListItem button onPress={()=>this.setModalVisible(true, item)} style={styles.listItem}>
          <Thumbnail square size={80} source={{uri: item.owner.avatar_url}} />
          <View style={styles.listItemConentent}>
            <Text>Name: <Text style={{fontWeight: '600', color: '#46ee4b'}}>{item.name}</Text></Text>
            <Text style={{color:'#007594'}}>{item.full_name}</Text>
            <Text note>Score: <Text note style={{marginTop: 5}}>{item.score}</Text></Text>
          </View>
        </ListItem>
      );
  }

  renderModal() {
    return(
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={()=>{alert('Modal has been closed')}}
      >
          {!this.state.selectedItem ? <Card /> :
            <Card style={{paddingTop: 20}}>
                <View style={styles.marginBottom}>
                  <Image style={styles.modalImage} source={{uri: this.state.selectedItem.owner.avatar_url}} resizeMode="contain"  />
                </View>
                <View style={styles.padding}>
                  <H3 style={[styles.marginBottom, {color: '#558674'}]}>{this.state.selectedItem.name}</H3>
                  <Text>
                    Type: <Text style={styles.bold}>{this.state.selectedItem.owner.type}</Text>
                  </Text>
                  <Text>
                    Stars: <Text style={styles.bold}>{this.state.selectedItem.stargazers_count}</Text>
                  </Text>
                  <Text>
                    Language: <Text style={styles.bold}>{this.state.selectedItem.language}</Text>
                  </Text>
                  <Text>
                    Open Issues: <Text style={styles.bold}>{this.state.selectedItem.open_issues_count}</Text>
                  </Text>
                  <Text style={styles.marginBottom}>
                    Last Update: <Text style={styles.bold}>{this.state.selectedItem.updated_at.slice(0,10)}</Text>
                  </Text>

                  <Button danger onPress={() => {
                    this.setModalVisible(!this.state.modalVisible, this.state.selectedItem)
                    }}>
                    <Text>Go Back</Text>
                  </Button>
                </View>
            </Card>
          }
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#00ff00"
  },
  listItemConentent: {
    padding: 10
  },
  listItem: {
    marginLeft: 0,
    padding: 10
  },
  modalImage: {
    alignSelf: 'center',
    height: 150,
    width: 150,
  },
  bold: {
    fontWeight: '600'
  },
  h2: {
    fontSize: 20
  },
  padding: {
    padding: 10
  },
  centerBlock: {
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  displayFlex: {
    display: 'flex'
  },
  flexDirectionRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  flexDirectionColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  justifyCenter: {
    justifyContent: 'center'
  },
  marginBottom: {
    marginBottom: 10
  },
  marginBottomHalf: {
    marginBottom: 5
  },
  flextItem: {
    flex: 1
  }
});
