import React from 'react';
import { Text } from 'react-native';

export const Ionicons = ({ name, size, color }) => <Text testID="ionicon">{name}</Text>;
export const AntDesign = ({ name, size, color }) => <Text testID="antdesign">{name}</Text>;
export const Entypo = ({ name, size, color }) => <Text testID="entypo">{name}</Text>;
export const EvilIcons = ({ name, size, color }) => <Text testID="evilicons">{name}</Text>;
export const Feather = ({ name, size, color }) => <Text testID="feather">{name}</Text>;
export const FontAwesome = ({ name, size, color }) => <Text testID="fontawesome">{name}</Text>;
export const FontAwesome5 = ({ name, size, color }) => <Text testID="fontawesome5">{name}</Text>;
export const Fontisto = ({ name, size, color }) => <Text testID="fontisto">{name}</Text>;
export const Foundation = ({ name, size, color }) => <Text testID="foundation">{name}</Text>;
export const MaterialIcons = ({ name, size, color }) => <Text testID="materialicons">{name}</Text>;
export const MaterialCommunityIcons = ({ name, size, color }) => <Text testID="materialcommunity">{name}</Text>;
export const Octicons = ({ name, size, color }) => <Text testID="octicons">{name}</Text>;
export const SimpleLineIcons = ({ name, size, color }) => <Text testID="simplelineicons">{name}</Text>;
export const Zocial = ({ name, size, color }) => <Text testID="zocial">{name}</Text>;

export default {
  Ionicons,
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Foundation,
  MaterialIcons,
  MaterialCommunityIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
};
