import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Button,
  Image,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
const App = () => {
  const FireBaseStorage = storage();
  const imagePickerOptions = {
    noData: true,
  };
  const [imageURI, setImageURI] = useState(null);
  const uploadFile = () => {
    ImagePicker.launchImageLibrary(imagePickerOptions, response => {
      if (response.didCancel) {
        alert('Post canceled');
      } else if (response.error) {
        alert('An error occurred: ', response.error);
      } else {
        setImageURI({uri: response.uri});
        Promise.resolve(uploadFileToFireBase(response));
      }
    });
  };
  const getFileLocalPath = response => {
    const {path, uri} = response;
    return Platform.OS === 'android' ? path : uri;
  };
  const createStorageReferenceToFile = response => {
    const {fileName} = response;
    return FireBaseStorage.ref(fileName);
  };
  const uploadFileToFireBase = response => {
    const fileSource = getFileLocalPath(response);
    const storageRef = createStorageReferenceToFile(response);
    return storageRef.putFile(fileSource);
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Button title="New Post" onPress={uploadFile} color="green" />
      {imageURI && <Image source={imageURI} style={styles.image} />}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    height: 300,
    width: '100%',
    resizeMode: 'contain',
  },
});
export default App;
