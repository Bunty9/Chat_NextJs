import styled from "styled-components";
import { Avatar, IconButton, Tooltip } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ChatIcon from "@material-ui/icons/Chat";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "../components/Chat";
import { useRouter } from "next/router";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Zoom from "@material-ui/core/Zoom";

function Sidebar() {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [chatsSnapshot] = useCollection(
        db.collection("chats").where("users", "array-contains", user.email)
    );
    const chatAlreadyExists = (recipientEmail) =>
        !!chatsSnapshot?.docs.find(
            (chat) =>
                chat.data().users.find((user) => user === recipientEmail)
                    ?.length > 0
        );

    const createChat = () => {
        const input = prompt(
            "Please enter an email address for the user you want to chat with"
        );
        if (!input) return null;
        if (
            EmailValidator.validate(input) &&
            !chatAlreadyExists(input) &&
            input !== user.email
        ) {
            //add email to db
            db.collection("chats").add({
                users: [user.email, input],
            });
        }
    };

    const logout = () => {
        auth.signOut();
        router.push(`/`);
    };

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const LightTooltip = withStyles((theme) => ({
        tooltip: {
            backgroundColor: theme.palette.common.white,
            color: "rgba(0, 0, 0, 0.87)",
            boxShadow: theme.shadows[1],
            fontSize: 11,
        },
    }))(Tooltip);

    const [searchTerm, setSearchTerm] = useState("");
    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} />
                <DisplayName>{user.displayName}</DisplayName>
                <IconsContainer>
                    <LightTooltip
                        TransitionComponent={Zoom}
                        title="Start a new chat"
                        placement="left"
                    >
                        <IconButton>
                            <ChatIcon onClick={createChat} />
                        </IconButton>
                    </LightTooltip>
                    <IconButton>
                        <MoreVertIcon onClick={handleClick} />
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={(handleClose, logout)}>
                            Logout
                        </MenuItem>
                        <MenuItem onClick={handleClose}>Settings</MenuItem>
                    </Menu>
                </IconsContainer>
            </Header>
            <Search>
                <SearchIcon />
                <SearchInput
                    placeholder="Search in chat"
                    onChange={(event) => {
                        setSearchTerm(event.target.value);
                    }}
                />
            </Search>
            {chatsSnapshot?.docs
                .filter((chat) => {
                    if (searchTerm == "") {
                        return chat;
                    } else if (
                        chat.data().users[0].includes(searchTerm) ||
                        chat.data().users[1].includes(searchTerm)
                    ) {
                        return chat;
                    }
                })
                .map((chat) => (
                    <Chat
                        key={chat.id}
                        id={chat.id}
                        users={chat.data().users}
                    />
                ))}
        </Container>
    );
}

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    border-right: 2px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 2px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
    margin: 10px;
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div`
    display: flex;
`;

const Search = styled.div`
    display: flex;
    padding: 20px;
    border-radius: 5px;
    align-items: center;
`;

const SearchInput = styled.input`
    outline-width: 0;
    flex: 1;
    border: none;
`;

const DisplayName = styled.p`
    padding: 10px;
    font-family: Montserrat;
`;
