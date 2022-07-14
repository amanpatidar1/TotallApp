import React, { useState, useRef, useEffect } from "react";
import "react-native-gesture-handler";
import {
  View,
  ScrollView,
  LogBox,
  Text,
  KeyboardAvoidingView,
  Image,
  Platform,
  StatusBar,
  Animated,
  FlatList,
  BackHandler,
  Alert,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Easing,
  AppState,
  ToastAndroid,
} from "react-native";
import io from "socket.io-client";
import { useNetInfo } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-community/async-storage";
import Button from "./app/component/Button";
import axios from "axios";
import _ from "lodash";
import styles from "./styles";
import TrackPlayer, { usePlaybackState } from "react-native-track-player";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Dialog, { DialogContent } from "react-native-popup-dialog";
import { SafeAreaView } from "react-native-safe-area-context";
import CountDown from "react-native-countdown-component";
let deviceWidth = Dimensions.get("window").width;
const BASEURL = "https://e.sandeepan.in";
const socket = io.connect(`${BASEURL}:9003`, { transports: ["websocket"] });
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreAllLogs();

function LectureView({ image, title }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fabtext();
  }, [fadeAnim]);
  const fabtext = () => {
    fadeAnim.setValue(0.3);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
    }).start(fabtext);
  };
  return (
    <View style={{ flex: 1 }}>
      <Image
        resizeMode="contain"
        style={styles.lectureImg}
        source={
          image !== "" ? { uri: image } : require("./app/assets/lecture.jpg")
        }
      />
      <View style={{ flex: 1 }}>
        <View style={styles.titleVw}>
          <Text style={styles.titleTxt}>{title}</Text>
        </View>
        <Animated.View style={[styles.opinionTxtVw, { opacity: fadeAnim }]}>
          <Text style={styles.opinionTxt}>Your opinion matters, </Text>
          <Text style={styles.opinionTxt}>question will appear soon.</Text>
        </Animated.View>
      </View>
      {/* <View style={styles.logOutVw}>
        <TouchableOpacity onPress={() => onLogout()} style={styles.logOutCon}>
          <Image
            source={require("./app/assets/logout-icone.png")}
            style={styles.logOutIcon}
          />
        </TouchableOpacity>
      </View> */}
    </View>
  );
}
function ResultView({ viewResult, onLogout }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.resultVw}>
          <Text style={styles.thanksTxt}>{"Thanks for Participation"}</Text>
          <Text style={styles.totalQuesTxt}>
            Total Questions : {viewResult.total_answer}
          </Text>
          <Text style={styles.answerTxt}>
            Correct Attempts : {viewResult.total_right_ans}
          </Text>
        </View>
      </View>
      <View style={styles.logOutBttnVw}>
        <TouchableOpacity
          onPress={() => onLogout()}
          style={styles.logOutBttnCon}
        >
          <Text style={styles.logoutTxt}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
function Splash({ navigation }) {
  const animatedValue = new Animated.Value(0);
  useEffect(() => {
    // handleAnimation();
    navigateToHome();
  }, []);
  const handleAnimation = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };
  async function navigateToHome() {
    // Splash screen will remain visible for 2 seconds
    const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));
    return wait(2000).then(() => navigation.navigate("Home"));
  }
  return (
    <View style={styles.splashVw}>
      <Image
        resizeMode="contain"
        source={require("./app/assets/Totall.png")}
        style={[styles.splashImg]}
      />
      <Image
        resizeMode="contain"
        source={require("./app/assets/Sandeepan.png")}
        style={[styles.splashImg]}
      />
    </View>
  );
}

function Home() {
  const netInfo = useNetInfo();
  const [userData, setUserData] = useState("");
  const [isFocusedLectureOtp, setIsfocusedLectureOtp] = useState(false);
  const [isFocusedUsername, setIsfocusedUsername] = useState(false);
  const [isFocusedPassword, setIsfocusedPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lectureOtp, setLectureOtp] = useState("");
  const [response, setResponse] = useState("");
  const [currentCount, setCount] = useState(0);
  const [questionsSbmt, setQuestionsSbmt] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [answer, setAnswer] = useState("");
  const [validation, setValidation] = useState(false);
  const [isConnect, setIsConnect] = useState(false);
  const [answerSnd, setAnswerSnd] = useState(false);
  const [noAnswer, setNoAnswer] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [selectAns, setSelectAns] = useState("");
  const [countWork, setCountDown] = useState(false);
  const [viewResult, setViewResult] = useState(null);
  const playbackState = usePlaybackState();
  const stateRef = useRef();
  let setTimer = null;
  stateRef.current = userData;
  const appState = useRef(AppState.currentState);
  const backAction = () => {
    Alert.alert("", "Are you sure you want to exit?", [
      {
        text: "Cancel",
        onPress: () => null,
      },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };
  const _handleAppStateChange = (nextAppState) => {
    if (
      // appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      socket.on("connect", function () {
        setIsConnect(false);
        console.log("socket  connect");
      });
    } else {
      //app goes to background
      console.log("app goes to background");
      socket.on("connect", function () {
        setIsConnect(false);
        console.log("socket  connect");
      });
      appState.current = nextAppState;
      console.log("AppState", appState.current);
    }
  };

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, [AppState]);

  useEffect(() => {
    // AsyncStorage.getItem('userDetails').then((token) => {
    //   setUserData(JSON.parse(token))
    // })
    AsyncStorage.getItem("lastDetail").then((token) => {
      if (token != null) {
        setUsername(JSON.parse(token).username);
        setPassword(JSON.parse(token).password);
        setLectureOtp(JSON.parse(token).lectureOtp);
      }
    });
  }, [userData]);
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  async function togglePlay() {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack == null) {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        // id: "local-track",
        url: require("./app/assets/music/Ambiphonic-lounge-easy-listening-music.mp3"),
        // title: "Pure (Demo)",
        // artist: "David Chavez",
        // artwork: "https://i.picsum.photos/id/500/200/200.jpg",
        // duration: 28
      });
      await TrackPlayer.play();
    } else {
      if (playbackState === TrackPlayer.STATE_PAUSED) {
        await TrackPlayer.play();
      }
    }
  }
  async function togglePause() {
    await TrackPlayer.reset();
  }

  async function handleAnswer(val) {
    setAnswer(val);
  }
  useEffect(() => {}, [showRight, questionsSbmt, answer, response]);
  useEffect(() => {
    socket.on("connect", function () {
      setIsConnect(false);
      console.log("socket  connect");
    });
    socket.on("sendtoMobileClient", async (data) => {
      console.log("dataSENDRRR: ", data);
      // if (setTimer) {
      //   // alert("STOP JJE")
      //   // clearTimeout(setTimer);
      //   setTimer = null;
      //   console.log("setTimer: ", setTimer);
      //   setShowRight(false);
      //   setQuestionsSbmt(false);
      //   setAnswer("");
      //   setResponse("");
      // }
      if (JSON.parse(data).lecture_id) {
        if (
          JSON.parse(data).user_data &&
          stateRef.current !== "" &&
          stateRef.current !== null
        ) {
          const userId = stateRef.current.user_id;
          const quesData = await _.filter(JSON.parse(data).user_data, {
            user_id: userId.toString(),
          });
          if (JSON.parse(data).lecture_id === stateRef.current.lecture_id) {
            if (quesData.length) {
              // await togglePlay()
              setAnswerSnd(false);
              setShowRight(false);
              setQuestionsSbmt(false);
              setAnswer("");
              setResponse(JSON.parse(data));
              setCount(JSON.parse(data).total_timer);
            }
          }
        }
      }
    });
    socket.on("disconnect", function () {
      setIsConnect(true);
      console.log("socket  disconnect");
    });
    socket.on("showResult", function (val) {
      setShowRight(true);
      // setResponse('')
      // console.log("showResult", val);
      responseNull();
    });
  }, []);
  const handleFinish = () => {
    setCount(0);
  };
  function closeAlert() {
    setResponse("");
    setNoAnswer(false);
  }
  function responseNull() {
    setTimer = setTimeout(() => {
      setResponse("");
      setShowRight(false);
      setNoAnswer(false);
    }, 3000);
  }
  function notAnswer() {
    if (response.user_data) {
      setNoAnswer(true);
    } else {
      // if (noAnswer == true) {
      if (stateRef.current !== "" && stateRef.current !== null) {
        if (questionsSbmt === false) {
          var val = {
            question_id: response.question_id,
            userid: stateRef.current.user_id,
            usertime: currentCount,
            userAns: "",
            deviceid: "fgdfgd555",
            isanswered: 0,
            isnew: response.isnew,
            lec_type: response.lec_type,
            lecture_id: response.lecture_id,
          };
          socket.emit("sendtoserver", val);
        }
      }
      // }
    }
  }

  useEffect(() => {
    if (currentCount === 0) {
      if (showRight === false) {
        if (questionsSbmt === false) {
          if (response.option_status === "0") {
            notAnswer();
            setResponse("");
          } else {
            notAnswer();
          }
        }
      }
      // togglePause()
    }
    // if (currentCount <= 0) {

    //   return;
    // }
  }, [currentCount]);

  async function login() {
    if (username !== "" && password !== "" && lectureOtp !== "") {
      setValidation(false);
      setIsLoading(true);
      try {
        const data = await axios.post(
          `${BASEURL}/admin/webservice/webservice.php?
        method=new_login&username=` +
            username +
            `&password=` +
            password +
            `&device=dfgdfgd555&
        device_token=dsfsdfsfsf&lecture_otp=` +
            lectureOtp
        );
        // console.log('response: ', data);
        if (data.data.success == 1) {
          var val = {
            username: username,
            lectureOtp: lectureOtp,
            password: password,
          };
          await AsyncStorage.setItem("userToken", "01");
          // await AsyncStorage.setItem('userDetails', JSON.stringify(data.data))
          await AsyncStorage.setItem("lastDetail", JSON.stringify(val));
          setUserData(data.data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          showPopupAlert(data.data.msg);
        }
      } catch (error) {
        setIsLoading(false);
        console.log("error: ", error);
      }
    } else {
      setValidation(true);
    }
  }
  function handleLogout() {
    Alert.alert("", "Are you sure you want to logout ?", [
      {
        text: "Cancel",
        onPress: () => null,
      },
      { text: "YES", onPress: () => logout() },
    ]);
    return true;
  }
  async function logout() {
    try {
      setIsLoading(true);
      const data = await axios.post(
        `${BASEURL}/admin/webservice/webservice.php?
       method=logout&user_id=` + stateRef.current.user_id
      );
      if (data.data.success == 1) {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("userDetails");
        setUserData("");
        setResponse("");
        setIsLoading(false);
        setViewResult(null);
      } else {
        setIsLoading(false);
        showPopupAlert(data.data.msg);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  function _handleFocusLectureOtp() {
    setIsfocusedLectureOtp(true);
    setIsfocusedPassword(false);
    setIsfocusedUsername(false);
  }
  function _handleFocusUsername() {
    setIsfocusedUsername(true);
    setIsfocusedPassword(false);
    setIsfocusedLectureOtp(false);
  }
  function _handleFocusPassword() {
    setIsfocusedPassword(true);
    setIsfocusedLectureOtp(false);
    setIsfocusedUsername(false);
  }
  const showPopupAlert = (message) => {
    Alert.alert("", message, [{ text: "OK" }]);
  };
  function onSubmit() {
    if (answer !== "") {
      var val = {
        question_id: response.question_id,
        userid: stateRef.current.user_id,
        usertime: currentCount,
        userAns: answer,
        deviceid: "fgdfgd555",
        isanswered: 1,
        isnew: response.isnew,
        lec_type: response.lec_type,
        lecture_id: response.lecture_id,
      };
      socket.emit("sendtoserver", val);
      setCount(0);
      setQuestionsSbmt(true);
      setAnswerSnd(true);
      answerSendFun();
      setSelectAns(answer);
      if (response.option_status === "0") {
        setResponse("");
      }
      // togglePause()
    } else {
      // showPopupAlert("Please select an option");
    }
  }
  const answerSendFun = () => {
    setTimeout(() => {
      setAnswerSnd(false);
    }, 2000);
  };
  useEffect(() => {
    socket.on("viewAllResult", async (data) => {
      const result = data.filter(
        (item) => item.user_id == stateRef.current.user_id
      );
      if (result.length > 0) {
        setViewResult(result);
        setAnswerSnd(false);
      }
    });
  }, []);
  useEffect(() => {
    socket.on("userLogout", (data) => {
      if (data) {
        logout();
      }
    });
  }, []);
  const ques = response.question
    ? response.question.replace(/(<([^>]+)>)/gi, "")
    : "";
  const options = response.options ? response.options.split(",") : [];
  const sequence = response.sequence ? response.sequence.split(",") : [];
  const colors = ["#0088FE", "#A52A2A", "#FFBB28", "#FF8042", "#D2691E"];
  const scalesPageToFit = Platform.OS === "android";
  const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 40;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="#00a4bf" />
      {loading === true && (
        <View style={styles.loaderVw}>
          <ActivityIndicator size={45} color="#00a4bf" />
        </View>
      )}
      <View style={styles.headerVw}>
        <Text style={styles.headerTxt}>TOTALL</Text>
      </View>
      {userData ? (
        <View style={{ backgroundColor: "#fff" }}>
          <View
            style={[
              styles.netInfoVw,
              {
                backgroundColor:
                  netInfo.isConnected == false ? "red" : "#ffffff",
              },
            ]}
          >
            <Text
              style={[
                styles.netInfoTxt,
                { color: netInfo.isConnected == false ? "#fff" : "#000000" },
              ]}
            >
              {netInfo.isConnected == false
                ? `You Are Disconnected`
                : `You Are Connected`}
            </Text>
          </View>
          {viewResult ? null : (
            <View style={styles.logOutVw}>
              <TouchableOpacity
                onPress={() => handleLogout()}
                style={styles.logOutCon}
              >
                <Image
                  source={require("./app/assets/logout-icone.png")}
                  style={styles.logOutIcon}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : null}
      {viewResult ? (
        <ResultView
          viewResult={viewResult.length > 0 ? viewResult[0] : null}
          onLogout={() => handleLogout()}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="always"
          style={{ backgroundColor: "#ffff" }}
        >
          <View style={styles.mainDiv}>
            {userData ? (
              response ? (
                response.user_data ? (
                  <View style={{ flex: 1 }}>
                    {currentCount === 0 || questionsSbmt == true ? null : (
                      <View>
                        <ActivityIndicator size={45} color="#00a4bf" />
                        <View style={styles.countTxt}>
                          <CountDown
                            until={currentCount}
                            running={true}
                            onFinish={() => handleFinish()}
                            size={13}
                            timeToShow={["S"]}
                            timeLabels={{}}
                            digitStyle={{
                              backgroundColor: "transparent",
                            }}
                          />
                        </View>
                      </View>
                    )}
                    <View style={styles.quesVw}>
                      <Text style={styles.qTxt}>Q.{response.Qno} </Text>
                      <Text style={styles.quesTxt}>{ques}</Text>
                    </View>
                    {response.lec_type === "0" || response.lec_type === "2" ? (
                      <View style={{ flex: 6 }}>
                        {options.map((value, i) => {
                          return (
                            <View
                              key={i}
                              style={{
                                flexDirection: "row",
                                padding: 5,
                                backgroundColor:
                                  showRight == true &&
                                  response.right_ans === sequence[i]
                                    ? "green"
                                    : showRight == true
                                    ? selectAns === sequence[i]
                                      ? "red"
                                      : ""
                                    : "",
                                // backgroundColor: answer === sequence[i] ? showRight && response.right_ans === sequence[i] ? 'green' : "#00a4bf" : showRight && response.right_ans === sequence[i] ? 'green' : ''
                              }}
                            >
                              <Text style={styles.optionTxt}>
                                {" "}
                                {sequence[i]}){" "}
                              </Text>
                              <Text style={styles.valueTxt}>
                                {value
                                  .replace(/<p[^>]*>/g, "")
                                  .replace(/<\/p>/g, "")}
                                {/* .replace(/(<([^>]+)>)/ig, "") */}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    ) : response.lec_type === "1" ? (
                      <View style={{ flex: 6 }}>
                        {options.map((value, i) => {
                          return (
                            <View
                              key={i}
                              style={{
                                flexDirection: "row",
                                padding: 5,
                                // backgroundColor:
                                //   showRight == true &&
                                //   response.right_ans === sequence[i]
                                //     ? "green"
                                //     : showRight == true
                                //     ? selectAns === sequence[i]
                                //       ? "red"
                                //       : ""
                                //     : "",
                                // backgroundColor: answer === sequence[i] ? showRight && response.right_ans === sequence[i] ? 'green' : "#00a4bf" : showRight && response.right_ans === sequence[i] ? 'green' : ''
                              }}
                            >
                              <Text style={styles.optionTxt}>
                                {" "}
                                {sequence[i]}){" "}
                              </Text>
                              <Text style={styles.valueTxt}>
                                {value
                                  .replace(/<p[^>]*>/g, "")
                                  .replace(/<\/p>/g, "")}
                                {/* .replace(/(<([^>]+)>)/ig, "") */}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    ) : response.option_status === "0" ? (
                      currentCount === 0 ? (
                        <View style={styles.sequenceVw}>
                          <FlatList
                            data={sequence}
                            numColumns={2}
                            renderItem={({ item, index }) => {
                              return (
                                <View
                                  key={index}
                                  style={{
                                    width: deviceWidth / 2,
                                    backgroundColor:
                                      selectAns === item
                                        ? showRight &&
                                          response.right_ans === item
                                          ? "green"
                                          : "red"
                                        : showRight &&
                                          response.right_ans === item
                                        ? "green"
                                        : colors[index],
                                    // backgroundColor: answer === item ? "#00a4bf" : showRight && response.right_ans === item ? 'green' : colors[index],
                                    margin: 3,
                                  }}
                                >
                                  <Text style={styles.sequencesTxt}>
                                    {item}
                                  </Text>
                                </View>
                              );
                            }}
                            keyExtractor={(item, index) => index}
                          />
                        </View>
                      ) : null
                    ) : (
                      <View style={{ flex: 6 }}>
                        {options.map((value, i) => {
                          return (
                            <View
                              key={i}
                              style={{
                                flexDirection: "row",
                                padding: 5,
                                // backgroundColor:
                                //   showRight == true &&
                                //   response.right_ans === sequence[i]
                                //     ? "green"
                                //     : showRight == true
                                //     ? selectAns === sequence[i]
                                //       ? "red"
                                //       : ""
                                //     : "",
                                // backgroundColor: answer === sequence[i] ? showRight && response.right_ans === sequence[i] ? 'green' : "#00a4bf" : showRight && response.right_ans === sequence[i] ? 'green' : ''
                              }}
                            >
                              <Text style={styles.optionTxt}>
                                {" "}
                                {sequence[i]}){" "}
                              </Text>
                              <Text style={styles.valueTxt}>
                                {(value &&
                                  value
                                    .replace(/<p[^>]*>/g, "")
                                    .replace(/<\/p>/g, "")) ||
                                  ""}
                                {/* .replace(/(<([^>]+)>)/ig, "") */}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    )}
                    {currentCount === 0 || questionsSbmt == true ? null : (
                      <>
                        <View style={styles.answerVw}>
                          <FlatList
                            data={sequence}
                            numColumns={2}
                            renderItem={({ item, index }) => {
                              return (
                                <TouchableOpacity
                                  key={index}
                                  onPress={() => handleAnswer(item)}
                                  style={{
                                    width: deviceWidth / 2.1,
                                    backgroundColor:
                                      answer === item
                                        ? "green"
                                        : showRight &&
                                          response.right_ans === item
                                        ? "green"
                                        : colors[index],
                                    margin: 3,
                                    borderRadius: 8,
                                  }}
                                >
                                  <Text style={styles.answerOptTxt}>
                                    {item}
                                  </Text>
                                </TouchableOpacity>
                              );
                            }}
                            keyExtractor={(item, index) => index}
                          />
                        </View>
                        {currentCount === 0 || questionsSbmt == true ? null : (
                          <View style={styles.submitBttn}>
                            <Button
                              title="Submit"
                              style={{ width: "95%", borderRadius: 10 }}
                              textStyle={{ fontSize: 30 }}
                              onPress={() => onSubmit()}
                            />
                          </View>
                        )}
                      </>
                    )}
                  </View>
                ) : (
                  <LectureView
                    image={stateRef.current.lecture_img}
                    title={stateRef.current.lecture_name}
                    // onLogout={() => handleLogout()}
                  />
                )
              ) : (
                <LectureView
                  image={stateRef.current.lecture_img}
                  title={stateRef.current.lecture_name}
                  // onLogout={() => handleLogout()}
                />
              )
            ) : (
              <View style={{ flex: 1 }}>
                <View style={styles.loginVw}>
                  <Image
                    resizeMode="contain"
                    style={styles.logoimg}
                    source={require("./app/assets/Totall.png")}
                  />
                  <Image
                    resizeMode="contain"
                    style={styles.logoimg}
                    source={require("./app/assets/Sandeepan.png")}
                  />
                </View>
                <View style={styles.loginCon}>
                  <KeyboardAvoidingView
                    behavior="position"
                    keyboardVerticalOffset={keyboardVerticalOffset}
                    style={styles.container}
                  >
                    <View
                      style={[
                        styles.txtipt,
                        {
                          borderColor: isFocusedLectureOtp
                            ? "#04a4bf"
                            : "#000000",
                          marginBottom: 15,
                        },
                      ]}
                    >
                      <TextInput
                        style={styles.txtipttxt}
                        placeholder="Id"
                        keyboardType={"numeric"}
                        underlineColorAndroid={"rgba(0,0,0,0)"}
                        onFocus={_handleFocusLectureOtp}
                        value={lectureOtp}
                        onChangeText={(text) => setLectureOtp(text)}
                      />
                    </View>
                    <View
                      style={[
                        styles.txtipt,
                        {
                          borderColor: isFocusedUsername
                            ? "#04a4bf"
                            : "#000000",
                          marginBottom: 15,
                        },
                      ]}
                    >
                      <TextInput
                        style={styles.txtipttxt}
                        placeholder="Name"
                        underlineColorAndroid={"rgba(0,0,0,0)"}
                        onFocus={_handleFocusUsername}
                        value={username}
                        onChangeText={(text) => setUsername(text)}
                      />
                    </View>
                    <View
                      style={[
                        styles.txtipt,
                        {
                          borderColor: isFocusedPassword
                            ? "#04a4bf"
                            : "#000000",
                          marginBottom: 15,
                        },
                      ]}
                    >
                      <TextInput
                        style={styles.txtipttxt}
                        placeholder="Mobile no"
                        keyboardType={"number-pad"}
                        underlineColorAndroid={"rgba(0,0,0,0)"}
                        onFocus={_handleFocusPassword}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                      />
                    </View>
                    {validation && (
                      <Text style={styles.validateTxt}>
                        {" "}
                        Please enter Id, name and mobile no
                      </Text>
                    )}
                    {<Button title="Login" onPress={() => login()} />}
                    {/* {
                    loading === true &&
                    <View style={{
                      zIndex: 10,
                      opacity: 0.9,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: "100%",
                      height: 60
                    }}>
                      <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: "#00a4bf",
                        width: deviceWidth / 6.8,
                        height: 50,
                        borderRadius: 100
                      }}>
                        <ActivityIndicator size={45} color="#ffff" />
                      </View>
                    </View>
                  } */}
                  </KeyboardAvoidingView>
                </View>
              </View>
            )}
            <Dialog
              visible={isConnect}
              // onTouchOutside={() => {
              //   set
              // }}
              height={0.1}
              width={0.6}
            >
              <DialogContent>
                <View style={{ paddingTop: 5 }}>
                  <Text style={{ textAlign: "center" }}>
                    You have disconnected, Please contact administrator!!!
                  </Text>
                </View>
              </DialogContent>
            </Dialog>
            <Dialog
              visible={answerSnd}
              // onTouchOutside={() => {
              //   set
              // }}
              height={0.1}
              width={0.5}
            >
              <DialogContent style={{ backgroundColor: "#8ac575" }}>
                <View style={{ marginVertical: 15 }}>
                  <Text style={styles.answerSndTxt}>
                    Your answer is Submitted
                  </Text>
                </View>
              </DialogContent>
            </Dialog>
            {/* <Dialog
              visible={noAnswer}
              // onTouchOutside={() => {
              //   set
              // }}
              height={0.18}
              width={0.6}
            >
              <DialogContent style={styles.notAnswerVw}>
                <View style={{ marginVertical: 5 }}>
                  <Text style={styles.wrongTxt}>This is Wrong</Text>
                  <Text style={{ textAlign: "center" }}>
                    You not selected any answer
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => closeAlert()}
                  style={styles.okBttn}
                >
                  <Text style={{ color: "#fff", fontSize: 18 }}>Ok</Text>
                </TouchableOpacity>
              </DialogContent>
            </Dialog> */}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function App() {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
