import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const primaryColor = "#19F1E6"; // Cyan for accents
const darkBackground = "#00003A"; // Dark blue for the background
const lightText = "#FFFFFF"; // White for contrast text
const successText = "#8aff81"; // success green color
const failText = "#fd8989"; // success red color

const Container = styled.div`
  font-family: "Poppins", sans-serif;
  color: ${lightText};
  overflow: hidden;
`;

const Input = styled.input`
  background: transparent;
  border: 2px solid ${primaryColor};
  padding: 13px;
  color: ${lightText};
  font-size: 18px;
  width: 100%;
  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  padding: 15px 30px;
  background-color: ${primaryColor};
  color: ${darkBackground};
  font-size: 18px;
  border: none;
  cursor: pointer;
`;

const ResponseSpan = styled.span`
  color: ${lightText};
  font-size: 20px;
  font-weight: 300;
`;

export default function ShowInterestInput() {
  const [email, setEmail] = useState("");
  const [isLoading, setLoader] = useState(false);
  const [isSuccessful, setResponseSuccessful] = useState<boolean | null>(null);
  const [respose, setResponse] = useState<null | string>("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);

    if (process.env.REACT_APP_CHNGE_API) {
      await axios
        .post(`${process.env.REACT_APP_CHNGE_API}/api/v1/lead`, { email })
        .then((response: any) => {
          // Handle the response from the server
          setEmail(""); // clear the input field
          setResponse("Keep an eye out on your email. We we will be in touch");
          setResponseSuccessful(true);
        })
        .catch((error: any) => {
          // Handle any errors
          setResponseSuccessful(false);
          setResponse("There was an error, unable post interest");
          console.error("There was an error!", error);
        });

      setLoader(false);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit} style={{ display: "flex" }}>
        <Input
          placeholder="Add your email"
          value={email}
          disabled={isLoading}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" disabled={isLoading}>
          Show Interest
        </Button>
      </form>
      <br />
      {respose && (
        <ResponseSpan
          style={isSuccessful ? { color: successText } : { color: failText }}
        >
          {respose}
        </ResponseSpan>
      )}
    </Container>
  );
}
