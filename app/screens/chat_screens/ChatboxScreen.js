import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Keyboard
} from 'react-native';
import ChatUser from '../../components/pages/ChatUser';
import HeaderIcon from '../../components/HeaderIcon';
import firestore from '@react-native-firebase/firestore';
import { GiftedChat } from 'react-native-gifted-chat';
import Paddings from '../../constants/Paddings';
import Colors from '../../constants/Colors';
import LoadingIndicator from '../../components/LoadingIndicator';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const db = firestore()
const chatsRef = db.collection('Chats')

const ChatboxScreen = ({ navigation, route }) => {
  const { top, bottom } = useSafeAreaInsets();
  const { userInfo, secondUser, threadId } = route.params
  const [loading, setLoading] = useState(false);
  const [keyboardShow, setKeyboardShow] = useState();
  const [seconduser, setseconduser] = useState({
    ...secondUser,
    profileImg: secondUser?.profileImg == undefined ? "https://cdn-icons-png.flaticon.com/128/64/64572.png" : secondUser?.profileImg
  })
  const [user, setUser] = useState({
    ...userInfo,
    profileImg: userInfo?.profileImg == undefined ? "https://cdn-icons-png.flaticon.com/128/64/64572.png" : userInfo?.profileImg
  })
  const [messages, setMessages] = useState([])
  const [userProperty, setUserProperties] = useState()
  console.log('chatroom', user, 'seconduser', seconduser)

  useEffect(() => {
    fetchUserProperties()
    const messagesListener = chatsRef
      .doc(threadId)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();

          const data = {
            _id: doc?.id,
            text: '',
            avatar: doc?.avatar,
            image: doc?.image,
            createdAt: new Date().getTime(),
            ...firebaseData
          };

          return data;
        });

        setMessages(messages);
      });

    // Stop listening for updates whenever the component unmounts
    return () => messagesListener();
  }, [])

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardShow(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardShow(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const fetchUserProperties = () => {
    const _id = user?.uid
    const email = user?.email
    const avatar = user?.profileImg
    const userProperty = { _id, email, avatar }
    setUserProperties(userProperty)
  }

  async function handleSend(messages) {
    const text = messages[0].text;
    try {
      firestore()
        .collection('Chats')
        .doc(threadId)
        .collection('Messages')
        .add({
          text,
          createdAt: new Date().getTime(),
          user: {
            _id: user?.uid,
            email: user?.email == undefined ? "" : user?.email,
            avatar: user?.profileImg == undefined ? "" : user?.profileImg
          }
        });

      await firestore()
        .collection('Chats')
        .doc(threadId)
        .set(
          {
            receiverName: seconduser?.name == undefined ? "" : seconduser?.name,
            receiverEmail: seconduser?.email == undefined ? "" : seconduser?.email,
            receiverImage: seconduser?.profileImg == undefined ? "" : seconduser?.profileImg,
            senderEmail: user?.email == undefined ? "" : user?.email,
            senderImage: user?.profileImg == undefined ? "" : user?.profileImg,
            senderName: user?.name == undefined ? "" : user?.name,
            senderId: user?.uid,
            receiverId: seconduser?.uid,
            latestMessage: {
              text,
              createdAt: new Date().getTime()
            }
          },
          { merge: true }
        );
    } catch (error) {
      console.log("Error is here", error)
    }

  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.secondaryColor }}>
      <LoadingIndicator loading={loading} />
      <View style={styles.titleBar}>
        <HeaderIcon isOpenDrawer={false} />
        <ChatUser
          style={styles.chatUser}
          image={seconduser?.profileImg}
          name={seconduser?.name}
          content={seconduser?.email}
        />
      </View>
      <View style={{ flex: 1, marginTop: -top, marginBottom: keyboardShow ? -bottom : bottom }}>
        <GiftedChat alignTop={true} messages={messages} user={userProperty} onSend={handleSend}
          alwaysShowSend
          showUserAvatar
          scrollToBottom
          bottomOffset={0}
          textInputStyle={{color:"black"}}
        />
      </View>
    </SafeAreaView>

  );
};

const paddingHorizontal = 20;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
  },
  titleBar: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal,
    paddingBottom: 5,
    zIndex:100
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 20,
    marginBottom: 20,
  },
  chatUser: {
    flex: 1,
    marginLeft: 20,
    marginRight: 10,
  },
  profileButton: {
    width: 100,
  },
  chatList: {
    flex: 1,
    width: '100%',
    borderColor: '#CCCCCC',
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  inputContainer: {
    height: 50,
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  chatInput: {
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 15,
    width: '100%',
  },
  rightIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightIcon: {
    paddingHorizontal: 5,
  },
  messageRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  message: {
    borderRadius: 10,
    fontSize: 16,
    maxWidth: '70%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexShrink: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});

export default ChatboxScreen;
