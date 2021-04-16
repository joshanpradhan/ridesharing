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
import { registerUrl } from "../../constants/url.js";
import axios from "axios";
import { UserContext } from "../../context/UserContext.js";
import { showMessage } from "react-native-flash-message";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required().min(6).max(50).label("Full name"),
  username: Yup.string().required().min(6).max(50).label("Username"),
  email: Yup.string().required().email().label("Email"),
  mobileNo: Yup.number().required().min(10).positive().label("Mobile No"),
  password: Yup.string().required().min(6).max(50).label("Password"),
});

export default Register = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const context = useContext(UserContext);

  onSubmitRegister = async (values) => {
    const { username, fullName, email, mobileNo, password } = values;
    try {
      await axios({
        method: "POST",
        url: registerUrl,
        data: {
          "username": username,
          "fullName": fullName,
          "email": email,
          "mobileNo": mobileNo,
          "password": password
        },
      }).then(function (response) {
        showMessage({
          message: "Congratulations, account has been created successfully",
          type: "success",
        });
        context.setUser(response.data.user);
        console.log(response.data.user);
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
                Create an account on ApexLyft
              </Text>
              <Text paragraph color={theme.colors.maroon}>
                Please enter your credentials to proceed.
              </Text>
              <Block center style={{ marginTop: 44 }}>
                <Formik
                  initialValues={{
                    fullName: "",
                    username: "",
                    email: "",
                    mobileNo: "",
                    password: "",
                  }}
                  onSubmit={(values) => {
                    setLoading(!loading);
                    onSubmitRegister(values);
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
                        autoFocus={true}
                        label="Full name"
                        style={{ marginBottom: 5 }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={handleChange("fullName")}
                        onBlur={() => setFieldTouched("fullName")}
                        value={values.fullName}
                      />
                      <ErrorMessage
                        error={errors.fullName}
                        visible={touched.fullName}
                      />
                      <Input
                        full
                        label="username"
                        style={{ marginBottom: 5 }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={handleChange("username")}
                        onBlur={() => setFieldTouched("username")}
                        value={values.username}
                      />
                      <ErrorMessage
                        error={errors.username}
                        visible={touched.username}
                      />
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
                        phone
                        label="Mobile no (+977)"
                        style={{ marginBottom: 5 }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={handleChange("mobileNo")}
                        onBlur={() => setFieldTouched("mobileNo")}
                        value={values.mobileNo}
                      />
                      <ErrorMessage
                        error={errors.mobileNo}
                        visible={touched.mobileNo}
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

                      {!errors.username &&
                      !errors.fullName &&
                      !errors.email &&
                      !errors.mobileNo &&
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
                            <Text button>Create an account</Text>
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
                          <Text button>Create an account</Text>
                        </Button>
                      )}

                      <Block center>
                        <Text h4 color="black">
                          Already have an account?{" "}
                          <Text
                            h4
                            height={18}
                            color={theme.colors.maroon}
                            onPress={() => navigation.navigate("Login")}
                          >
                            Log In
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
