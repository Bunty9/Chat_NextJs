import styled from "styled-components"
import {Avatar, IconButton , Button} from "@material-ui/core"
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatIcon from '@material-ui/icons/Chat';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from "../components/Chat";
import { useRouter } from 'next/router';

function Sidebar() {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [chatsSnapshot] = useCollection( 
        db
            .collection('chats')
            .where("users" , "array-contains" , user.email)
    );
    const chatAlreadyExists = (recipientEmail) => 
        !!chatsSnapshot?.docs.find(
            (chat) => 
                chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

    const createChat = () => {
        const input = prompt("Please enter an email address for the user you want to chat with");
        if (!input) return null;
        if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input!== user.email){
            //add email to db
            db.collection("chats").add({
                users : [user.email , input],
            });
        }
    
    };
   

   
    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={() =>{auth.signOut(); router.push(`/`);}} />
                <IconsContainer>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </IconsContainer>
            </Header>
            <Search>
                <SearchIcon />
                <SearchInput placeholder = 'Search in chat'/>
            </Search>
            <SidebarButton onClick = {createChat}>  
                Start a new chat
            </SidebarButton>

        {/* List of chats */}
        {chatsSnapshot?.docs.map(chat => (
            <Chat key={chat.id} id={chat.id} users={chat.data().users} />
        ))}

        </Container>
    )
}

export default Sidebar


const Container = styled.div`
    flex : 0.45;
    border-right : 2px solid whitesmoke;
    height :100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar{
        display :none;
    }
    -ms-overflow-style : none;
    scrollbar-width: none;
`;

const SidebarButton = styled(Button)`
width: 100%;
&&&{
    border-top: 2px solid whitesmoke;
    border-bottom: 2px solid whitesmoke;
}
`;


const Header = styled.div`
display: flex;
position: sticky;
top: 0;
background-color: white;
z-index: 1;
justify-content:space-between;
align-items:center;
padding:15px;
height: 80px;
border-bottom: 2px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
margin: 10px;
cursor: pointer;
:hover{
    opacity: 0.8;

}
`;


const IconsContainer = styled.div``;

const Search = styled.div`
display:flex;
padding:20px;
border-radius: 5px;
align-items: center;
`;


const SearchInput = styled.input`
outline-width:0;
flex: 1;
border:none;
`;


