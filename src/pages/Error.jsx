import styles from "./page_styles/Error.module.css";

import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function Error({ errorCode }) {
  const location = useLocation();
  const errorNum = location.state?.errorNum || errorCode;

  const errorNames = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    408: "Request Timeout",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
  };

  const errorDescriptions = {
    400: "The server could not understand the request.",
    401: "You must be authenticated to access this resource.",
    403: "You do not have permission to access this resource.",
    404: "The requested resource could not be found.",
    408: "The server timed out waiting for the request.",
    429: "You have sent too many requests in a given amount of time.",
    500: "Something went wrong on the server.",
    502: "The server received an invalid response from the upstream server.",
    503: "The server is currently unavailable (overloaded or down).",
    504: "The server did not receive a timely response from the upstream server.",
  };

  function getErrorName(errorCode) {
    return errorNames[errorCode] || "Unknown Error";
  }

  function getErrorDescription(errorCode) {
    return errorDescriptions[errorCode] || "An unknown error occurred.";
  }

  const errorName = errorNames[errorNum] || "Unknown Error";
  const errorDescription =
    errorDescriptions[errorNum] || "An unknown error occurred.";

  return (
    <>
      <div className={styles.flexwrapper}>
        <div className={styles.content}>
          <div className={styles.text}>
            <h1>{errorNum}</h1>
            <h2>{errorName}</h2>
            <p>{errorDescription}</p>
            <a href="/">Back to Homepage</a>
          </div>
        </div>
      </div>
    </>
  );
}
