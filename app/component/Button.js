import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";

const Button = (props) => {
  const { title, onPress, style, textStyle } = props;
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={[
        {
          height: 60,
          width: "100%",
          alignSelf: "center",
          backgroundColor: "#00a4bf",
          marginTop: 24,
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Text
        style={[
          {
            alignSelf: "center",
            color: "#ffffff",
            fontSize: 21,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
Button.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
};
export default Button;
