import styled from "styled-components"
import ChatScreen from "../../components/ChatScreen"
import Sidebar from "../../components/Sidebar"
import Head from "next/head"
import { auth, db } from "../../firebase/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import getRecipientEmail from "../../utils/getRecipientEmail"

function Chat({chat,messages}) {
    const [user] = useAuthState(auth);

    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users,user)}</title>
            </Head>
            <Sidebar/>
            <ChatContainer>
                <ChatScreen    chat = {chat} messages={messages} />
            </ChatContainer>
        </Container>
    )
}

export default Chat

export async function getServerSideProps(context){
    const ref = db.collection("chats").doc(context.query.id);

    const messageRes = await ref
        .collection("messages")
        .orderBy("timestamp","asc")
        .get()

    const messages = messageRes.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })).map((messages)=> ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime(),
    }));

    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data(),
    }
    console.log(chat,messages);
    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat,
        }
    }
}


const Container = styled.div`
display:flex;

`;

const ChatContainer = styled.div`
flex: 1;
overflow:scroll;
height:100vh;
::-webkit-scrollbar {
    display:none;
}
-ms-overflow-style: none;
scrollbar-width: none;
`;

