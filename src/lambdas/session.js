import axios from "axios";
import { pathOr } from "ramda";
import { buildOrderData } from "../lambda-utils/buildOrderData";

export async function createSession(event, props) {

  let { order_lines } = event;
  console.log(order_lines)
  console.log(buildOrderData(order_lines))
  const url = `${props.context.apiLink}sessions`


  try {
    const response = await axios.post(
      url,
      buildOrderData(order_lines)
    );
    return {
      statusCode: 200,
      body: response.data
    };
  } catch (e) {
    const statusCode = pathOr(500, ["response", "status"], e);
    const message = pathOr(
      ["Something went wrong"],
      ["response", "data", "error_messages"],
      e
    ).join(", ");

    return {
      statusCode,
      body: JSON.stringify({
        message
      })
    };
  }
}
