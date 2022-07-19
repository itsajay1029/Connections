import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabPanels,
  TabList,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useHistory } from "react-router-dom";

const Homepage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        textAlign="center"
        //alignItems="baseline"
        p={3}
        bg={"hsl(0deg 0% 13%) "}
        color="#E7EAED"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        borderColor={"black"}
      >
        <Text fontSize="4xl" fontFamily="Work Sans">
          Connections
        </Text>
      </Box>

      <Box
        bg="hsl(0deg 0% 13%)"
        w="100%"
        p="4"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="black"
      >
        <Tabs variant="soft-rounded">
          <TabList mb={"1em"}>
            <Tab width="50%" _selected={{ color: "white", bg: "#2B3595" }}>
              Login
            </Tab>
            <Tab width="50%" _selected={{ color: "white", bg: "#2B3595" }}>
              SignUp
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
