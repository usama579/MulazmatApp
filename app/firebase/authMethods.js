import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export async function  getUserInfo() {
    let user=[];
    const currentUser = auth().currentUser;
      let snapshot = await firestore()
      .collection('Users')
      .where('uid', '==', currentUser.uid)
      .get().catch(() => {
        throw ('user token is expired') 
       });

    snapshot.forEach((doc) => {
          user.push({
            key: doc.id,
            uid:doc.data().uid,
            name: doc.data().name,
            email: doc.data().email,
            profileImg : doc.data().profileImg,
            phoneNo : doc.data().phoneNo
          });
        });
        console.log("callles", user[0])
    return user[0]
}

export async function getUserChats() {
  let chatsArray=[];
  const currentUser = auth().currentUser;
  let senderSnapshot = await firestore()
    .collection('Chats')
    .where('senderId', '==', currentUser.uid)
    .get()
    .catch(() => {
      throw ('user token is expired') 
    });

  let receiverSnapshot = await firestore()
    .collection('Chats')
    .where('receiverId', '==', currentUser.uid)
    .get()
    .catch(() => {
      throw ('user token is expired') 
    });
  
    senderSnapshot.forEach((doc) => {
      chatsArray.push({
        senderId: doc.data().senderId,
        receiverId: doc.data().receiverId,
        senderName: doc.data().senderName,
        receiverName: doc.data().receiverName,
        latestMessage: doc.data().latestMessage,
        receiverImage: doc.data().receiverImage,
        senderImage: doc.data().senderImage,
        senderEmail:doc.data().senderEmail,
        receiverEmail:doc.data().receiverEmail
      });
    });

    receiverSnapshot.forEach((doc) => {
      chatsArray.push({
        senderId: doc.data().senderId,
        receiverId: doc.data().receiverId,
        senderName: doc.data().senderName,
        receiverName: doc.data().receiverName,
        latestMessage: doc.data().latestMessage,
        receiverImage: doc.data().receiverImage,
        senderImage: doc.data().senderImage,
        senderEmail:doc.data().senderEmail,
        receiverEmail:doc.data().receiverEmail
      });
    });
    console.log('chats',chatsArray)
  return chatsArray
}