// React Native Axios – To Make HTTP API call in React Native
// https://aboutreact.com/react-native-axios/

import React,{useState} from 'react';
//import React in our code.
import {StyleSheet, View,FlatList, TouchableOpacity, Text} from 'react-native';
//import all the components we are going to use.
import axios from 'axios';

const App = () => {
  const [data,setData]=useState()
 
  const getDataUsingAsyncAwaitGetCall = async () => {
    
      const response = await axios.get(
        'https://ridesharingheroku.herokuapp.com/notifications',
      );
   
      setData(response.data)  
      console.log(response.data)
        
  };


  const postDataUsingAsyncAwaitPostCall = async () => {
              const response= await axios.post('https://ridesharingheroku.herokuapp.com/notifications/',  {
               title: 'my joshan pardhan'
          },)
  }

const submitLogin=async()=>{
  const response = await axios
  .post('https://ridesharingheroku.herokuapp.com/auth/local/register/', {
    identifier: 'user@strapi.io',
    password: 'strapiPassword',
  })
  .then(response => {
    // Handle success.
    console.log('Well done!');
    console.log('User profile', response.data.user);
    console.log('User token', response.data.jwt);
  })
  .catch(error => {
    // Handle error.
    console.log('An error occurred:', error.response);
  });

}

  const renderItem = ({ item }) => (
    <Text>{item.title}</Text>
  );
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 30, textAlign: 'center'}}>
        Example of Axios Networking in React Native
      </Text>
      {/*Running GET Request*/}

      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={getDataUsingAsyncAwaitGetCall}>
        <Text>Get Data Using Async Await GET</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={postDataUsingAsyncAwaitPostCall}>
        <Text>Post Data Using Async Await GET</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={submitLogin}>
        <Text>Post Data </Text>
      </TouchableOpacity>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    padding: 16,
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: '100%',
    marginTop: 16,
  },
});

export default App;