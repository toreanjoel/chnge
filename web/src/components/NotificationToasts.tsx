import styled from "styled-components";
import icon from "../assets/icon.png";
import { useEffect } from "react";

const NotificationWrapper = styled.div`
  bottom: 35em;
  right: 9em;
  position: absolute;
  @media (max-width: 1000px) {
    right: 6em;
  }
  @media (max-width: 900px) {
    right: 0;
    bottom: 30em;
  }
  @media (max-width: 768px) {
    bottom: 0;
    position: relative;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
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
  opacity: 0;
  @media (max-width: 900px) {
    width: 290px;
  }
`;

const NotificationTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  @media (max-width: 900px) {
    font-size: 16px;
  }
`;

const NotificationBody = styled.div`
  font-size: 16px;
  @media (max-width: 900px) {
    font-size: 14px;
  }
`;

const NotifiactionBadge = styled.img`
  max-width: 50px;
  height: fit-content;
  margin-right: 10px;
  align-self: center;
`;

const TOASTS = [
  {
    "title": "Good Morning! ☕",
    "description": "More of the same today, but buy yourself a coffee - you deserve it!"
  },
  {
    "title": "Check in time 👀",
    "description": "Don't forget to add transactions for the day 📊"
  },
  {
    "title": "Pattern Emerging ⚠️",
    "description": "I'm noticing a trend around your mood and buying sweets."
  },
]

export default function NotificationToasts() {
  return (
    <NotificationWrapper>
      {
        TOASTS.map((item: any, index: number) => {
          return (
            <Notification style={{transition: "1s", animationDelay: `${String(index)}s`, opacity: 1 }}>
              <NotifiactionBadge alt="App Icon" src={icon} />
              <div>
                <NotificationTitle>{item.title}</NotificationTitle>
                <NotificationBody>
                  {item.description}
                </NotificationBody>
              </div>
            </Notification>
          )
        })
      }
    </NotificationWrapper>
  );
}
