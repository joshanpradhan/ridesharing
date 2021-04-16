import React, { useState, useContext } from "react";
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
import {
  Button,
  Block,
  Text,
  Input,
  ErrorMessage,
} from "../../components/Index.js";
import { loginUrl } from "../../constants/url.js";
import axios from "axios";
import { UserContext } from "../../context/UserContext.js";
import { showMessage } from "react-native-flash-message";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).max(50).label("Password"),
});

export default Register = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const context = useContext(UserContext);

  onSubmitLogin = async (values) => {
    const {email, password } = values;
    try {
      await axios({
        method: "POST",
        url: loginUrl,
        data: {
          "identifier": email,
          "password": password
        },
      }).then(function (response) {
        showMessage({
          message: "Lgged In successfully",
          type: "success",
        });
        context.setUser(response.data.user);
        setLoading(false);
        navigation.navigate("MainTab");
      });
    } catch (error) {
      showMessage({
        message: "Sorry, we could not proceed your request. Try with different credentials again!",
        type: "danger",
      });
      console.log(error);
      setLoading(false);
    }
  };
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
                ApexLyft
              </Text>
              <Text paragraph color={theme.colors.maroon}>
                Please enter your credentials to proceed.
              </Text>
              <Block center style={{ marginTop: 44 }}>
                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                  }}
                  onSubmit={(values) => {
                    setLoading(!loading);
                    onSubmitLogin(values);
                  }}
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
                        email
                        label="Email address"
                        style={{ marginBottom: 5 }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={handleChange("email")}
                        onBlur={() => setFieldTouched("email")}
                        value={values.email}
                      />
                      <ErrorMessage
                        error={errors.email}
                        visible={touched.email}
                      />
                      <Input
                        full
                        password
                        label="Password"
                        style={{ marginBottom: 5 }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={handleChange("password")}
                        onBlur={() => setFieldTouched("password")}
                        value={values.password}
                      />
                      <ErrorMessage
                        error={errors.password}
                        visible={touched.password}
                      />

                      { !errors.email &&
                      !errors.password ? (
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
                            <Text button>Log In</Text>
                          )}
                        </Button>
                      ) : (
                        <Button
                          full
                          style={{
                            marginBottom: 12,
                            backgroundColor: theme.colors.gray,
                          }}
                        >
                          <Text button>Log In</Text>
                        </Button>
                      )}
                       <Block center>
                        <Text h4 color="black">
                          Don't have an account?{" "}
                          <Text
                            h4
                            height={18}
                            color={theme.colors.maroon}
                            onPress={() => navigation.navigate("Register")}
                          >
                            Register
                          </Text>
                        </Text>
                      </Block>
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
