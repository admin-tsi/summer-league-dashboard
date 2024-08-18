import React from "react";

type WelcomeMessageProps = {
  firstName: string;
  lastName: string;
};

const WelcomeMessage = ({ firstName, lastName }: WelcomeMessageProps) => (
  <span className="text-3xl">
    Welcome back, {firstName} {lastName}
  </span>
);

export default WelcomeMessage;
