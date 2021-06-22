import { createOrder, verifyPayment } from "./Apis/payments";

const useRazorpay = () => {
  const handlePayment = async (
    dataToBeSent,
    optionsForTheModal,
    dismissModal,
    capturePayment
  ) => {
    // Creating a new order
    await createOrder(dataToBeSent, (order) => {
      if (!order) {
        alert("Something went wrong!");
        return;
      }

      const options = {
        // PUBLIC KEY
        key: process.env.REACT_APP_RAZORPAY_PUBLIC_KEY,
        order_id: order.id,
        handler: async (response) => {
          // data to be sent in this format to the backend
          const paymentInfo = {
            orderCreationId: order.id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            ...dataToBeSent,
          };

          verifyPayment(paymentInfo, (verifiedData) => {
            return capturePayment(verifiedData);
          });
        },
        ...optionsForTheModal,
        theme: optionsForTheModal.theme
          ? optionsForTheModal.theme
          : {
              color: "#61dafb",
            },
        modal: {
          ondismiss: function () {
            dismissModal();
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    });
  };

  return handlePayment;
};

export default useRazorpay;
