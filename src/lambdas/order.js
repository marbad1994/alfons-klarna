import axios from "axios";
import { pathOr } from "ramda";
import { buildOrderData } from "../lambda-utils/buildOrderData";

export async function createOrder(event, props) {
  const url = `${props.context.apiLink}order`
  const payload = event;
  const { order_lines, authorization_token } = payload;
  console.log(order_lines)

  try {

    const response = await axios.post(
      url,
      {order_lines: buildOrderData(order_lines), authorization_token: authorization_token}
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

// export async function getOrder(event) {
//   const orderId = event.path.split("/").pop();

//   try {
//     const response = await axios.get(
//       `https://api.playground.klarna.com/ordermanagement/v1/orders/${orderId}`,
//       {
//         auth: credentials
//       }
//     );

//     return {
//       statusCode: 200,
//       body: JSON.stringify(response.data)
//     };
//   } catch (e) {
//     const statusCode = pathOr(500, ["response", "status"], e);
//     const message = pathOr(
//       ["Something went wrong"],
//       ["response", "data", "error_messages"],
//       e
//     ).join(", ");

//     return {
//       statusCode,
//       body: JSON.stringify({
//         message
//       })
//     };
//   }
// }
