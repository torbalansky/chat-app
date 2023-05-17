import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

//custom actions for the chat input toolbar
const CustomActions = ({  wrapperStyle,  iconTextStyle,  onSend,  storage,  userID, }) => {
  const actionSheet = useActionSheet();
// Function called when an action is pressed in the action sheet
  const onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;

    // Function to get the user's current location
    const getLocation = async () => {
      let permissions = await Location.requestForegroundPermissionsAsync();
      if (permissions?.granted) {
        const location = await Location.getCurrentPositionAsync({});
        if (location) {
          console.log("location accessed")
          // Send the location as a message
          onSend({
            location: {
              longitude: location.coords.longitude,
              latitude: location.coords.latitude,
            },
          });
        } else {
          Alert.alert("Error occured while fetching location. ");
        }
      } else {
        Alert.alert("Location permissions have not been granted");
      }
    };

    // Function to generate a unique reference for the uploaded image
    const generateReference = (uri) => {
      const timeStamp = new Date().getTime();
      const imageName = uri.split("/")[uri.split("/").length - 1];
      return `${userID}-${timeStamp}-${imageName}`;
    };

    // Function to upload and send an image
    const uploadAndSendImage = async (imageURI) => {
      const uniqueStringRef = generateReference(imageURI);
      const newUploadRef = ref(storage, uniqueStringRef);
      const response = await fetch(imageURI);
      const blob = await response.blob();
      uploadBytes(newUploadRef, blob).then(async (snapshot) => {
        console.log("File Uploaded");
        const imageURL = await getDownloadURL(snapshot.ref);
        console.log(imageURL);
        onSend({ image: imageURL });
      });
    };

     // Function to pick an image from the library and upload it
    const pickImage = async () => {
      let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissions?.granted) {
        let result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) {
          const imageURI = result.assets[0].uri;
          const uniqueRefString = generateReference(imageURI);
          const response = await fetch(imageURI);
          const blob = await response.blob();
          const newUploadRef = ref(storage, uniqueRefString);
          uploadBytes(newUploadRef, blob).then(async (snapshot) => {
            console.log('File has been uploaded successfully');
            const imageURL = await getDownloadURL(snapshot.ref)
            onSend({ image: imageURL })
          }) 
        }
        else Alert.alert("Permissions haven't been granted.");
      }
    }

    // Function to take a photo using the camera and upload it
    const takePhoto = async () => {
      let permissions = await ImagePicker.requestCameraPermissionsAsync();
      if (permissions?.granted) {
        try {
          let result = await ImagePicker.launchCameraAsync();
          if (!result.canceled) {
            await uploadAndSendImage(result.assets[0].uri);
          }
        } catch (error) {
          Alert.alert("Error occurred while taking photo");
        }
      } else {
        Alert.alert("Permissions haven't been granted.");
      }
    };

    // Show the action sheet with the provided options
    actionSheet.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex: cancelButtonIndex, 
          textStyle: { color: '#A9A9A9' },
        },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            await pickImage();
            break;
          case 1:
            await takePhoto();
            break;
          case 2:
            await getLocation();
            break;
          default:
            break;
        }
      }
    );
  };

    return (
        <TouchableOpacity style={styles.container} onPress={onActionPress}>
          <View style={[styles.wrapper, wrapperStyle]}>
            <Text style={[styles.iconText, iconTextStyle]}>+</Text>
          </View>
        </TouchableOpacity>
      );
    };
    
    const styles = StyleSheet.create({
        container: {
            width: 26,
            height: 26,
            marginLeft: 10,
            marginBottom: 10,
        },
        wrapper: {
            borderRadius: 13,
            borderWidth: 2,
            backgroundColor: "#007AFF", 
            borderColor: "#007AFF", 
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        iconText: {
            color: "#FFF",
            fontWeight: "bold",
            fontSize: 16, 
            backgroundColor: "transparent",
            textAlign: "center",
        },
      });
      
    export default CustomActions;