import styled, { keyframes } from "styled-components";
import logo from "./assets/logo.png";
import phone from "./assets/phone.svg";

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
  padding: 1rem 2rem;
  border-radius: 50px; // More rounded edges
  background-color: ${secondaryColor};
  color: white;
  text-decoration: none;
  font-weight: bold;
  text-align: center;
  display: inline-block;
  transition: all 0.3s ease-in-out;
  &:hover {
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
`;

const Subtitle = styled.p`
  font-size: 1.75rem;
  color: ${lightText};
  margin-bottom: 2rem;
  font-family: "Avenir", sans-serif;
`;

const Highlight = styled.span`
  color: ${secondaryColor};
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  justify-content: center;
  padding: 1.5em 4em;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  color: ${lightText};
  margin-bottom: 1rem;
  font-family: "Avenir", sans-serif;
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
              Transform Yourself through <Highlight>chnge</Highlight>. Master
              Your Money, Master Your Life.
            </Title>
            <Subtitle>
              Cultivate lasting habits. Redefining your financial
              destiny, one transaction at a time.
            </Subtitle>
            <Button href="#">Download</Button>
          </TextSection>
        </ContentSection>

        <ImageSection>
          {/* Placeholder for a phone image */}
          <ImgWrapper>
            <img alt="App phone screen example" src={phone} style={{ maxWidth: "inherit", width: "100%" }} />
          </ImgWrapper>
        </ImageSection>
      </Main>
    </Container>
  );
}

export default App;
