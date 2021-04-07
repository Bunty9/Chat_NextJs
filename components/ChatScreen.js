
import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components"
import { auth } from "../firebase";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';

function ChatScreen({chat,messages}) {
    const [user] = useAuthState(auth);
    const router = useRouter();

    return (
        <Container>
            <Header>
                <Avatar/>
                <HeaderInformation>
                    <h3>Rec email</h3>
                    <p>lastSeen...</p>
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
                <EndofMessage/>
            </MessageContainer>
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


const MessageContainer = styled.div``;

const EndofMessage = styled.div``;

