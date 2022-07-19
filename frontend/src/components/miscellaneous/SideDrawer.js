import {
  Avatar,
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  flexbox,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    user,
    setSelectedChat,
    selectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const history = useHistory();
  const toast = useToast();

  const logooutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in the search !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred !",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        "Content-type": "applicatioon/json",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chats !",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        p="5px 10px 5px 10px"
        w="100%"
        bg="black"
        color={"white"}
        height="60px"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tooltip
          label="Search Users to Chat"
          hasArrow
          placement="bottom-end"
          bg="white"
          color="black"
        >
          <Button
            variant="ghost"
            onClick={onOpen}
            _hover={{ bg: "none" }}
            _active={{ bg: "none" }}
          >
            <AiOutlineSearch />
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontFamily={"Poppins"} fontSize="2xl">
          Connections
        </Text>

        <div>
          <Menu>
            <MenuButton p={1} bg="black">
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            <MenuList p={0} m={0} bg="black" color="white">
              {!notification.length && <Box pl={2}>No New Messages</Box>}
              {notification.map((notif) => {
                return (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(
                        notification.filter((n) => n.chat._id != notif.chat._id)
                      );
                    }}
                    pl={2}
                    _hover={{ bg: "#E7EAED", color: "black" }}
                    _expanded={{ bg: "#E7EAED", color: "black" }}
                    _focus={{ boxShadow: "black" }}
                    _active={{ bg: "#E7EAED", color: "black" }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              bg="black"
              color="white"
              _hover={{ bg: "black" }}
              _expanded={{ bg: "black" }}
              _focus={{ boxShadow: "black" }}
              _active={{ bg: "none" }}
            >
              <Avatar
                size={"sm"}
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>

            <MenuList bg="black" color="white">
              <ProfileModal user={user}>
                <MenuItem
                  _hover={{ bg: "#E7EAED", color: "black" }}
                  _expanded={{ bg: "#E7EAED", color: "black" }}
                  _focus={{ boxShadow: "black" }}
                  _active={{ bg: "#E7EAED", color: "black" }}
                >
                  My Profile
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                onClick={logooutHandler}
                _hover={{ bg: "#E7EAED", color: "black" }}
                _expanded={{ bg: "#E7EAED", color: "black" }}
                _focus={{ boxShadow: "black" }}
                _active={{ bg: "#E7EAED", color: "black" }}
              >
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="hsl(0deg 0% 13%)">
          <DrawerHeader borderBottomWidth="1px" color="white">
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box style={{ display: "flex" }} p="2" pb={5}>
              <Input
                color="white"
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                onClick={handleSearch}
                _hover={{ bg: "black", color: "white" }}
                _active={{ bg: "black", color: "white" }}
              >
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
              })
            )}

            {loadingChat && <Spinner ml="auto" style={{ display: "flex" }} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
