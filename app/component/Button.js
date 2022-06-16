import React from 'react';
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';

const Button = ({ title, onPress, }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={{
        height: 60,
        width: "100%",
        alignSelf: "center",
        // borderRadius: 10,
        backgroundColor: "#00a4bf",
        marginTop: 24,
        justifyContent: "center",
      }}>
      <Text style={{
        alignSelf: "center",
        color: "#ffffff",
        fontSize: 22,
      }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
Button.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
};
export default Button;