import React from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

export default function Repository({ navigation }) {
  const repository = navigation.getParam('repository');

  return <WebView style={{ flex: 1 }} source={{ uri: repository.html_url }} />;
}

Repository.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

Repository.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('repository').name,
  headerTitleAlign: 'center',
});
