import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ButtonDiv,
  ProfileButton,
  ProfileButtonText,
  DeleteButton,
} from './styles';

export default class Main extends Component {
  // eslint-disable-next-line react/sort-comp
  static navigationOptions = {
    title: 'Usuários',
    headerTitleAlign: 'center',
  };

  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  // eslint-disable-next-line react/state-in-constructor
  state = {
    newUser: '',
    users: [],
    loading: false,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({ users: JSON.parse(users) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { users } = this.state;

    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    const { users, newUser } = this.state;

    const userExist = users.filter(user => user.login === newUser);

    if (userExist.length !== 0) {
      this.setState({
        newUser: '',
        loading: false,
      });

      Alert.alert(
        'Error',
        'Usuário já cadastrado.\nPor favor, insira um usuário válido.',
        [{ text: 'OK', onPress: () => {} }],
        { cancelable: false },
      );
    } else {
      this.setState({ loading: true });

      try {
        const response = await api.get(`/users/${newUser}`);
        const data = {
          name: response.data.name,
          login: response.data.login,
          bio: response.data.bio,
          avatar: response.data.avatar_url,
        };

        this.setState({
          users: [...users, data],
          newUser: '',
          loading: false,
        });

        Keyboard.dismiss();
      } catch (error) {
        this.setState({
          newUser: '',
          loading: false,
        });

        Alert.alert(
          'Error',
          'Erro ao buscar usuário.\nPor favor, insira um usuário válido.',
          [{ text: 'OK', onPress: () => {} }],
          { cancelable: false },
        );
      }
    }
  };

  handleNavigate = user => {
    const { navigation } = this.props;

    navigation.navigate('User', { user });
  };

  handleDelete = userDelete => {
    const { users } = this.state;

    const data = users.filter(user => user.login !== userDelete.login);
    this.setState({ users: data });
  };

  render() {
    const { users, newUser, loading } = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar usuário"
            value={newUser}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Icon name="add" size={20} color="#FFF" />
            )}
          </SubmitButton>
        </Form>

        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({ item }) => (
            <User>
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              <ButtonDiv>
                <ProfileButton onPress={() => this.handleNavigate(item)}>
                  <ProfileButtonText>Ver Perfil</ProfileButtonText>
                </ProfileButton>
                <DeleteButton onPress={() => this.handleDelete(item)}>
                  <Icon name="delete" size={20} color="#FFF" />
                </DeleteButton>
              </ButtonDiv>
            </User>
          )}
        />
      </Container>
    );
  }
}
