import styled from "styled-components";

const ContainerWrapper = styled.div`
  font-size: 14px;
  color: #ffffff;
  margin: 15px 0 0 0;
`

const Heading = styled.div`
  font-size: 1rem;
  font-weight: 600;
  padding-bottom: 2px;
`

export default function WhatYouGet() {
  return (
    <ContainerWrapper>
      <div>
        <div> 🔗 Development Updates</div>
        <div> 🤐 Early Access</div>
        <div> 🔓 Premium Features / Discounts</div>
        <div> 🚧 Influence on Product Outcome</div>
      </div>
      <br />
      <div>
        <Heading>
          Privacy:
        </Heading>
        <div>
          Emails will be kept private. You will only recieve updates on progress, early access releases and launch updates.
        </div>
      </div>
    </ContainerWrapper>
  );
}
