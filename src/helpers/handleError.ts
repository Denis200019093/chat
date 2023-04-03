import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return (
    typeof error === "object" &&
    error != null &&
    "status" in error &&
    "errors" in error
  );
}

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error != null &&
    "message" in error &&
    typeof error.message === "string"
  );
}

function isErrorWithData(error: unknown): error is { data: string } {
  return (
    typeof error === "object" &&
    error != null &&
    "data" in error &&
    typeof error.data === "string"
  );
}

// function isErrorWithData(error: unknown): error is { data: string } {
//   return (
//     typeof error === "object" &&
//     error != null &&
//     "data" in error &&
//     typeof error.data === "string"
//   );
// }

export const handleError = (error: unknown) => {
  if (isErrorWithData(error)) {
    // const errData = "data" in error ? error.data : JSON.stringify(error.data);
    // const errMsg = "error" in error ? error.error : JSON.stringify(error.data);
    alert(error.data);
  } else {
    console.log("An unexpected error occurred:", error);
    alert("An unexpected error occurred. Please try again later.");
  }
};
// export const handleError = (error: unknown) => {
//   if (isFetchBaseQueryError(error)) {
//     const errMsg = "data" in error ? error.data : JSON.stringify(error.data);
//     // const errMsg = "error" in error ? error.error : JSON.stringify(error.data);
//     alert(errMsg);
//   } else if (isErrorWithMessage(error)) {
//     console.log(error.message);
//     alert(error.message);
//   } else {
//     console.log("An unexpected error occurred:", error);
//     alert("An unexpected error occurred. Please try again later.");
//   }
// };

// try {
//   // some code
// } catch (error) {
//   handleError(error);
// }
