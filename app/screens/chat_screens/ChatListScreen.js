import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, FlatList, TouchableOpacity } from 'react-native';
import ChatUser from '../../components/pages/ChatUser';
import { getUserChats, getUserInfo } from "../../firebase/authMethods"
import { useFocusEffect } from '@react-navigation/native';
import Paddings from '../../constants/Paddings';
import Colors from '../../constants/Colors';
import LoadingIndicator from '../../components/LoadingIndicator';
import HeaderIcon from '../../components/HeaderIcon';
import { Searchbar } from 'react-native-paper';
import HeadingText from '../../components/HeadingText';
import routes from '../../navigation/routes';

const ChatListScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [chatsArray, setChatsArray] = useState([])
  const [userInfo, setUserInfo] = useState([])
  const [isUser, setIsUser] = useState(false)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchArray, setSearchArray] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchChats()
      fetchUserinfo()
    }, [])
  );

  useEffect(() => {
    if (searchQuery !== '') {
      const result = chatsArray.filter(chatsArray => {
        if (userInfo?.uid == chatsArray?.senderId) {
          return chatsArray?.receiverName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        } else {
          return chatsArray?.senderName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        }
      });
      setSearchArray(result);
    }
  }, [searchQuery]);

  const fetchUserinfo = async () => {
    await getUserInfo().then((response) => {
      setUserInfo(response)
    })
  }

  const fetchChats = async () => {
    setLoading(true)
    await getUserChats().then((response) => {
      console.log("response in chats232:", response)
      const { key, chatsArray } = response
      setLoading(false)
      setChatsArray(response)
    }).catch((error) => {
      setLoading(false)
      console.log("error:", error)
    })
  }

  const onChangeSearch = query => setSearchQuery(query);

  const renderItem = (item) => {
    const { receiverName, receiverId, senderId, receiverEmail, receiverImage, senderImage, senderName, senderEmail } = item
    const { text } = item.latestMessage
    console.log('sneder', senderId + senderName, 'current', userInfo?.uid + userInfo?.ProfileName, 'recievr', receiverId + receiverName)
    const roomName = (senderId < receiverId ? senderId + '_' + receiverId : receiverId + '_' + senderId);
    if (userInfo?.uid === senderId) {
      setIsUser(true)
    } else {
      setIsUser(false)
    }
    return (
      <TouchableOpacity style={styles.listItem}
        onPress={() =>
          navigation.navigate(routes.CHAT_BOX_SCREEN, {
            formChatList: true,
            threadId: roomName,
            userInfo: userInfo,
            secondUser: { name: userInfo?.uid === senderId ? receiverName : senderName, profileImg: userInfo?.uid === senderId ? receiverImage : senderImage, email: userInfo?.uid === senderId ? receiverEmail : senderEmail, uid: userInfo?.uid === senderId ? receiverId : senderId }
          })
        }>
        <ChatUser
          style={styles.chatUser}
          image={userInfo?.uid === senderId ? receiverImage : senderImage}
          name={userInfo?.uid === senderId ? receiverName : senderName}
          content={text}
        />
        {/* </TouchableOpacity> */}
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.secondaryColor }}>
      <View style={styles.screen}>
        <LoadingIndicator loading={loading} />
        <HeaderIcon isOpenDrawer={true} />
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        <HeadingText
          style={{
            marginVertical: 10,
          }}>
          Chats
        </HeadingText>
        <View style={styles.mainContainer}>
          {/* {visible ?
          (<ActivityIndicator
            size='large'
            visible={visible}
            color={'#D83E64'}
            style={{ marginBottom: 10 }}
          />
          ):( */}
          <FlatList
            style={styles.chatList}
            data={searchQuery !== '' ? searchArray : chatsArray}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => renderItem(item)}
          />
          {/* )} */}
        </View>
      </View>
    </SafeAreaView>
  );
}
const paddingHorizontal = 20;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10
  },
  screen: {
    flex: 1,
    paddingHorizontal: Paddings.normalPadding,
    paddingBottom: Paddings.normalPadding,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  searchBox: {
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDDDDD',
    paddingHorizontal: 15,
    marginTop: 20
  },
  chatList: {
    flex: 1,
    width: '100%',
    marginTop: 20,
    // backgroundColor:"red"
  },
  chatUser: {
    // flex: 1
  },
  mainContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal,
    paddingTop: 10,
  },
  listItem: {
    paddingHorizontal,
    paddingVertical: 10,
    // display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButton: {
    width: 100,
    marginLeft: 10
  },
  listBorder: {
    borderColor: '#999999',
    borderTopWidth: 1,
    marginTop: 10
  }
});

export default ChatListScreen;
