import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { emitAnalyticsLog } from "../utils/firebaseConfig"

const primaryColor = "#19F1E6"; // Cyan for accents
const darkBackground = "#00003A"; // Dark blue for the background
const lightText = "#FFFFFF"; // White for contrast text
const successText = "#8aff81"; // success green color
const failText = "#ff8b8b"; // success red color

const Container = styled.div`
  font-family: "Poppins", sans-serif;
  color: ${lightText};
  overflow: hidden;
`;

const Input = styled.input`
  background: transparent;
  border: 1px solid ${primaryColor};
  padding: 13px;
  color: ${lightText};
  font-size: 18px;
  width: 100%;
  &:focus {
    outline: none;
  }
  @media (max-width: 768px) {
    padding: 10px 15px;
    font-size: 25px;
    width: auto;
    margin: 10px 0;
    height: 2em;
  }
`;

const Button = styled.button`
  background-color: ${primaryColor};
  color: ${darkBackground};
  font-size: 16px;
  border: none;
  cursor: pointer;
  width: 200px;
  @media (max-width: 768px) {
    font-size: 20px;
    height: 50px;
    width: 100%;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ResponseDiv = styled.div`
  color: ${lightText};
  font-size: 15px;
  font-weight: 300;
  padding: 10px 0;
`;

export default function InterestInput() {
  // const analytics = getAnalytics();
  const [email, setEmail] = useState("");
  const [isLoading, setLoader] = useState(false);
  const [isSuccessful, setResponseSuccessful] = useState<boolean | null>(null);
  const [respose, setResponse] = useState<null | string>("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    emitAnalyticsLog("submit_user_lead")

    if (process.env.REACT_APP_CHNGE_API) {
      await axios
        .post(`${process.env.REACT_APP_CHNGE_API}/v1/lead`, { email })
        .then((response: any) => {
          // Handle the response from the server
          setEmail(""); // clear the input field
          setResponse("Keep an eye out on your email. We will be in touch");
          setResponseSuccessful(true);
          emitAnalyticsLog("success_lead_submit")
        })
        .catch((error: any) => {
          // Handle any errors
          setResponseSuccessful(false);
          setResponse("There was an error, unable to send request. Try again later.");
          console.error("There was an error!", error);
          emitAnalyticsLog("failed_lead_submit")
        });

      setLoader(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Input
          placeholder="add@email.here"
          value={email}
          disabled={isLoading}
          onFocus={() => emitAnalyticsLog("focus_lead_input")}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" disabled={isLoading}>
          Notify Me 🔔
        </Button>
      </Form>
      {respose && (
        <ResponseDiv
          style={isSuccessful ? { color: successText } : { color: failText }}
        >
          {respose}
        </ResponseDiv>
      )}
    </Container>
  );
}
