import styled, { keyframes } from "styled-components";
import logo from "./assets/logo.png";
import icon from "./assets/icon.png";
import phone from "./assets/phone.svg";
import ShowInterestinput from "./components/ShowInterestinput";
import WhatYouGet from "./components/WhatYouGet";
import google from "./assets/icons8-google-play.svg";
import apple from "./assets/icons8-app-store.svg";

// Updated color palette with darker background
const primaryColor = "#19F1E6"; // Cyan for accents
const secondaryColor = "#168EE5"; // Blue for interactive elements
const tertiaryColor = "#A03AFE"; // Purple for secondary accents
const darkBackground = "#00003A"; // Dark blue for the background
const lightText = "#FFFFFF"; // White for contrast text
const accentText = "#F0F2F5"; // Light grey for secondary text

// Animation for button hover
const hoverAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled components with creative enhancements
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
  background-color: #05141e;
  color: ${lightText};
  overflow: hidden;
`;

const Header = styled.header`
  background-color: transparent;
`;

const Main = styled.main`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  max-width: 1200px;
  position: relative;
  margin: 0 auto;
  overflow: hidden;
  @media (max-width: 768px) {
    flex-direction: column; // Stack the sections on smaller screens
  }
`;

const TextSection = styled.section`
  padding-right: 2rem;
  margin: 0;
`;

const Button = styled.a`
  padding: 0.75em;
  color: white;
  border-radius: 10px;
  text-decoration: none;
  font-weight: bold;
  text-align: center;
  display: inline-block;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  width: 100px;
  justify-content: center;
  background-color: ${secondaryColor};
  &:hover {
    cursor: pointer;
    animation: ${hoverAnimation} 0.5s ease-in-out;
  }
`;

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5em 0;
  background-color: ${secondaryColor};
  background-image: linear-gradient(${primaryColor}, ${secondaryColor});
  z-index: 0;
`;

const Subtitle = styled.p`
  font-size: 1.75rem;
  color: ${lightText};
  margin-bottom: 2rem;
  font-family: "Avenir", sans-serif;
`;

const Highlight = styled.span`
  color: ${primaryColor};
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  justify-content: center;
  padding: 1.5em 4em;
  z-index: 2;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  color: ${lightText};
  margin-bottom: 1rem;
  font-family: "Avenir", sans-serif;
  line-height: 40px;
`;

const ImgWrapper = styled.div`
  max-width: inherit;
  width: 130em;
  position: absolute;
  bottom: -50%;
  right: -60em;
  @media (max-width: 880px) {
    position: relative;
    bottom: 0;
    right: 0;
    width: 100%;
  }
`;

const NotificationWrapper = styled.div`
  bottom: 50em;
  right: 61em;
  position: absolute;
`;

const Notification = styled.div`
  background-color: #ffffff;
  color: #05141e;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-family: "Helvetica", "Arial", sans-serif;
  margin-bottom: 10px;
  z-index: 3;
  width: 320px;
  display: flex;
  flex-direction: row;
`;

const NotificationTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const NotificationBody = styled.div`
  font-size: 16px;
`;

const NotifiactionBadge = styled.img`
  max-width: 50px;
  height: fit-content;
  margin-right: 10px;
  align-self: center;
`;

// React component updated for brand consistency
function App() {
  return (
    <Container>
      <Main>
        <ContentSection>
          <Header>
            <img src={logo} alt="chnge logo" style={{ height: "50px" }} />
          </Header>
          <TextSection>
            <Title>
              {/* Foster Positive Habits Through <Highlight>chnge</Highlight> with AI. */}
              Shape Your Financial Future with <Highlight>chnge</Highlight>.
            </Title>
            <Subtitle>
              AI-driven and designed to help you build healthier financial
              habits, day by day.
              <br />
              <br />
              Get ready for a transformation in the way you manage your money,
              be among the first to take control of your financial wellness.
            </Subtitle>
            <ShowInterestinput />
            {/* <WhatYouGet /> */}
            {/* <div style={{ display: "flex", flexDirection: "row" }}>
              <Button href="#" style={{ marginRight: 10 }}>
                <img alt="Google Play Store" src={google} style={{ width: 30, height: 30, marginRight: 10 }} />
                Google
              </Button>
              <Button href="#" style={{ marginRight: 10 }}>
                <img alt="Apple App Store" src={apple} style={{ width: 30, height: 30, marginRight: 10 }} />
                Apple
              </Button>
            </div> */}
          </TextSection>
        </ContentSection>

        <ImageSection>
          {/* Placeholder for a phone image */}
          <ImgWrapper>
            <NotificationWrapper>
              <Notification>
                <NotifiactionBadge alt="App Icon" src={icon} />
                <div>
                  <NotificationTitle>Good Morning! ☕</NotificationTitle>
                  <NotificationBody>
                    More of the same today, but buy yourself a coffee - you
                    deserve it!
                  </NotificationBody>
                </div>
              </Notification>
              <Notification>
                <NotifiactionBadge alt="App Icon" src={icon} />
                <div>
                  <NotificationTitle>Check in time 👀</NotificationTitle>
                  <NotificationBody>
                    Don't forget to add transactions for the day 📊
                  </NotificationBody>
                </div>
              </Notification>
            </NotificationWrapper>
            <img
              alt="App phone screen example"
              src={phone}
              style={{ maxWidth: "inherit", width: "100%" }}
            />
          </ImgWrapper>
        </ImageSection>
      </Main>
    </Container>
  );
}

export default App;
