
import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components"
import { auth, db } from "../firebase/firebase";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from "../components/Message"
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useState } from "react";
import SendIcon from '@material-ui/icons/Send';
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail"
import TimeAgo from "timeago-react"
import { useRef } from "react";

function ChatScreen({chat,messages}) {
    const [user] = useAuthState(auth);
    const [input,setInput] = useState("");
    const router = useRouter();

    const endofMessageRef = useRef(null);
    const scrollToBottom = () => {
        endofMessageRef.current.scrollIntoView({
            behavior:"smooth",
            block: "start"
        });
    }

    const [messagesSnapshot]= useCollection(
        db
            .collection("chats")
            .doc(router.query.id)
            .collection("messages")
            .orderBy("timestamp","asc")
    );
    const showMessages = () => {
        if(messagesSnapshot){
            return messagesSnapshot?.docs.map((message) => (
                <Message 
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ))
        }//else{
        //     return JSON.parse(message).map(message =>(
        //         <Message 
        //         key={message.id}
        //         user={message.user}
        //         message={message}
        //         />
        //     ))
        // }
    }

    const sendMessage = (e) => {
        e.preventDefault();

        db.collection("users").doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        },{merge: true});
        db.collection("chats").doc(router.query.id).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email, 
            photoURL: user.photoURL,
        })
        setInput("");
        scrollToBottom();
    }

    const [recipientSnapshot]= useCollection(
        db
            .collection("users")
            .where("email","==",getRecipientEmail(chat.users,user))
    )
    const recipient =recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users,user);



    return (
        <Container>
            <Header>
                {recipient ? (
                    <UserAvatar src={recipient?.photoURL}/>
                ) :(
                    <UserAvatar>{recipientEmail[0].toUpperCase()}</UserAvatar>
                )}
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>Last Active : {'  '}{recipient?.lastSeen?.toDate() ? (
                            <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                        ):"Unavailable"}</p>
                    ) :(
                        <p>Last Active :  loading . . .</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {/* show messages */}
                {showMessages()}
                <EndofMessage ref= {endofMessageRef}/>
            </MessageContainer>
            <InputContainer>
                <InsertEmoticonIcon/>
                <Input value={input}  onChange={e => setInput(e.target.value)} />
                <IconButton disabled={!input} type="submit" onClick={sendMessage} >
                    <SendIcon />
                </IconButton>
                
                <MicIcon/>
            </InputContainer>
        </Container>
    )
}

export default ChatScreen



const Container = styled.div``;


const Header = styled.div`
position: sticky;
background-color:white;
z-index:100;
top: 0;
display: flex;
padding:10px;
align-items: center;
border-bottom:2px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
margin: 5px;
margin-right:10px;
`;

const HeaderInformation = styled.div`
margin-left:15px;
flex:1;
>h3{
    margin-bottom:3px;
}
>p{
    font-size:14px;
    color:gray;
}
`;


const HeaderIcons = styled.div``;


const MessageContainer = styled.div`
padding:30px;
background-color: #e1e3cc;
min-height:90vh;

`;

const EndofMessage = styled.div`
margin-bottom : 50px;
`;

const InputContainer = styled.form`
display: flex;
align-items: center;
padding: 10px;
position: sticky;
background-color: white;
z-index: 1;
bottom: 0;
`;


const Input = styled.input`
flex: 1;
align-items: center;
position: sticky;
padding: 10px;
bottom: 0;
background-color: whitesmoke;
z-index: 100;
border: none;
border-radius:5px;
outline: none;
margin-left: 10px;
margin-right: 10px;
`;
