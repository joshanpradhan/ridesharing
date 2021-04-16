import React, { useState,useContext,useRef,useEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as theme from "../../constants/theme.js";
import { showMessage } from "react-native-flash-message";
import {
  Button,
  Block,
  Text,
  Input,
  ErrorMessage,
} from "../../components/Index.js";
import { savedAddressUrl } from "../../constants/url.js";
import axios from "axios";
import { UserContext } from "../../context/UserContext.js";

const validationSchema = Yup.object().shape({
  description: Yup.string()
    .required()
    .min(6)
    .max(100)
    .label("Description"),
  title: Yup.string()
    .required()
    .min(2)
    .max(100)
    .label("Title")
});

export default AddAddressInfo = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const context = useContext(UserContext);

  const onSubmitAddAddressInfoRequest = async (values) => {
    try {
      await axios({
        method: "POST",
        url: savedAddressUrl,
        data: {
          user:context.user.id,
          title:values.title,
          icon:route.params.icon,
          destinationPointLatitudeCoordinate:route.params.destinationPointCoordinateLatitude,
          destinationPointLongitudeCoordinate:route.params.destinationPointCoordinateLongitude,
          description: values.description,
        },
      }).then(async(response)=>{
        showMessage({
          message: "Success, your address has been saved",
          type: "success",
        });
        setLoading(false);
        navigation.navigate("Home");
      })
      
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
   
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    return () => {
      source.cancel();
      };
  }, []);

  return (
    <KeyboardAwareScrollView
      style={{ marginVertical: 10 }}
      showsVerticalScrollIndicator={false}
    >
      <KeyboardAvoidingView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Block center middle>
            <Block style={{ marginTop: 20 }}>
              <Image
                source={require("../../assets/icons/scooter.png")}
                style={{ height: 100, width: 100 }}
              />
            </Block>
            <Block flex={2.5} center>
              <Text h3 style={{ marginBottom: 6 }} color={theme.colors.maroon}>
                Please enter your credentials
              </Text>

              <Block center style={{ marginTop: 44 }}>
                <Formik
                  initialValues={{
                    description: ""
                  }}
                  onSubmit={(values) => {
                    setLoading(!loading);
                    onSubmitAddAddressInfoRequest(values)}
                  }
                  validationSchema={validationSchema}
                >
                  {({
                    handleChange,
                    touched,
                    setFieldTouched,
                    handleSubmit,
                    values,
                    errors,
                  }) => (
                    <Block>
                      <Input
                        full
                        autoFocus={true}
                        label="Title"
                        style={{ marginBottom: 5 }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={handleChange("title")}
                        onBlur={() => setFieldTouched("title")}
                        value={values.title}
                      />
                      <ErrorMessage
                        error={errors.title}
                        visible={touched.title}
                      />
                      <Input
                        full
                        label="Description"
                        style={{ marginBottom: 5 }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={handleChange("description")}
                        onBlur={() => setFieldTouched("description")}
                        value={values.description}
                      />
                      <ErrorMessage
                        error={errors.description}
                        visible={touched.description}
                      />

                      
                      {!errors.description &&
                      !errors.title
                       ? (
                        <Block>
                          <Button
                            full
                            style={{
                              marginBottom: 12,
                            }}
                            onPress={handleSubmit}
                          >
                            {loading ? (
                              <ActivityIndicator
                                size="small"
                                color={theme.colors.white}
                              />
                            ) : (
                              <Text button>Add address</Text>
                            )}
                          </Button>
                        </Block>
                      ) : (
                        <Block>
                          <Button
                            full
                            style={{
                              marginBottom: 12,
                              backgroundColor: theme.colors.gray,
                            }}
                            disabled={true}
                          >
                            <Text button>Add address</Text>
                          </Button>
                        </Block>
                      )}

                      <Button
                        full
                        style={{
                          marginBottom: 12,
                          backgroundColor: theme.colors.red,
                        }}
                        onPress={() => navigation.goBack()}
                      >
                        <Text bold color={theme.colors.white}>
                          Go back
                        </Text>
                      </Button>
                    </Block>
                  )}
                </Formik>
              </Block>
            </Block>
          </Block>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

