import React,{useState} from 'react';
import { View, StyleSheet, Text, Image, TouchableHighlight } from 'react-native';
import assets from '../../assets';

const Item = (props) => {
  const [isImageBroken, setIsImageBroken] = useState(false)
  const style = props.style;

  const onPress = () => {
    if (props.onPress)
      props.onPress();
  }

  return (
    <View style={[styles.container, style]}>
      {props.image && !isImageBroken ? (
        <Image
          style={styles.image}
          source={{ uri: props.image }}
          onError={() => setIsImageBroken(true)}
        />
      ) : (
        <Image
          style={styles.image}
          source={assets.images.samples.avatar1}
          onError={() => setIsImageBroken(true)}
        />
      )}
      <View style={styles.rightContainer}>
        <Text style={styles.name}>{props.name}</Text>
        <Text style={styles.content} numberOfLines={1}>{props.content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10
  },
  rightContainer: {
    flex: 1,
    height: 25,
    paddingVertical: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  name: {
    color:"black",
    fontSize: 16
  },
  content: {
    fontSize: 15,
    color: 'grey'
  }
});

export default Item;
