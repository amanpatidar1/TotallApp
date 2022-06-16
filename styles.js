import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  splashVw: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splashImg: {
    right: 20,
    height: 20,
    width: 20,
  },
  mainDiv: {
    flex: 1,
    marginTop: 3,
  },
  loaderVw: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: "grey",
    opacity: 0.9,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  headerVw: {
    paddingTop: 19,
    paddingBottom: 5,
    backgroundColor: "#00a4bf",
    flexDirection: "row",
    alignItems: "center",
  },
  headerTxt: {
    flex: 1,
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 25,
  },
  netInfoVw: {
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  netInfoTxt: {
    fontSize: 16,
  },
  countTxt: {
    width: width,
    position: "absolute",
    textAlign: "center",
    top: 7,
  },
  quesVw: {
    flexDirection: "row",
    padding: 5,
    marginRight: 16,
  },
  qTxt: {
    fontWeight: "bold",
    fontSize: 22,
    marginRight: 2,
  },
  quesTxt: {
    fontWeight: "bold",
    fontSize: 16,
    paddingTop: 5,
    paddingRight: 10,
    width: width / 1.2,
  },
  sequenceVw: {
    flex: 3,
    paddingLeft: 2,
    paddingRight: 5,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", //Here is the trick
    bottom: 5,
  },
  sequencesTxt: {
    fontWeight: "bold",
    fontSize: 19,
    textAlign: "center",
    color: "#ffffff",
    padding: 15,
  },
  optionTxt: {
    fontWeight: "bold",
    fontSize: 19,
    marginRight: 5,
  },
  valueTxt: {
    fontWeight: "900",
    fontSize: 17,
    marginRight: 20,
  },
  answerVw: {
    flex: 3,
    paddingLeft: 2,
    paddingRight: 5,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 70,
    marginTop: 10,
  },
  answerOptTxt: {
    fontWeight: "bold",
    fontSize: 19,
    textAlign: "center",
    color: "#ffffff",
    padding: 15,
  },
  submitBttn: {
    width: width,
    position: "absolute", //Here is the trick
    bottom: 0,
  },
  loginVw: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  logoimg: {
    width: 150,
    height: 150,
  },
  container: {
    marginBottom: 20,
    padding: 16,
  },
  loginCon: {
    flex: 2,
    justifyContent: "flex-end",
  },
  validateTxt: {
    fontSize: 15,
    color: "red",
  },
  txtipt: {
    width: "100%",
    alignSelf: "center",
    justifyContent: "flex-start",
    paddingLeft: 10,
    borderWidth: 1,
  },
  txtipttxt: {
    color: "#000",
    fontSize: 18,
    // fontFamily: FONT_FAMILY_BOLD,
    // marginTop: 11,
    marginLeft: 4,
    borderBottomWidth: 0,
  },
  lectureImg: {
    resizeMode: "contain",
    width: width,
    height: width / 1.5,
    marginTop: 50,
  },
  titleVw: {
    resizeMode: "contain",
    width: width,
    height: width / 1.5,
    marginTop: 50,
  },
  titleTxt: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  opinionTxtVw: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", //Here is the trick
    bottom: 8,
  },
  opinionTxt: {
    fontSize: 19,
    fontWeight: "bold",
  },
  logOutVw: {
    position: "absolute",
    width: width,
    alignItems: "flex-end",
    paddingRight: 15,
  },
  logOutCon: {
    backgroundColor: "#fff",
    width: 38,
    height: 38,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.55,
    shadowRadius: 14.78,
    elevation: 14,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  logOutIcon: {
    resizeMode: "contain",
    width: 30,
    height: 30,
  },
  resultVw: {
    flex: 1,
    justifyContent: "center",
  },
  thanksTxt: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#00a4bf",
  },
  totalQuesTxt: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
  },
  answerTxt: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  logOutBttnVw: {
    alignItems: "center",
    paddingVertical: 20,
  },
  logOutBttnCon: {
    backgroundColor: "#00a4bf",
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.55,
    shadowRadius: 14.78,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  logoutTxt: {
    fontWeight: "800",
    color: "#fff",
    fontSize: 16,
  },
  answerSndTxt: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
  },
});
export default styles;