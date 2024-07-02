import React from "react";

const MailTo = ({email, subject, title}) => {
    let hrefString = `mailto:${email}?subject=${subject}`
    return <a href={hrefString}>{title}</a>
  }

export default MailTo;