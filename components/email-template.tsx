import * as React from "react";

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  email,
  otp,
}) => (
  <div>
    <h3>Welcome, {email}!</h3>
    <p>Your otp is {otp} Your otp is only valid for 10 minutes</p>
  </div>
);
