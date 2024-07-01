import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express();

var instance = new Razorpay({
  key_id: "rzp_test_Dc6srvy7yHvxnq",
  key_secret: "VZc9JsrY0coqC1YbAEkOTgQi",
});

router.route("/").get((req, res) => {
  return res.send("Hello world");
});

router.route("/create").post((req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };
    instance.orders.create(options, (err, order) => {
      if (err) {
        return res.status(500).json({ message: "Could not place order" });
      } else {
        return res.status(200).json({ data: order });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Bad request" });
  }
});

router.route("/get").get((req,res) => {
  const options = {}
  try {
    var data = instance.orders.all(options, (err, data) => {
      if (!err) {
        return res.status(200).json({data: data});
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.route("/new").post((req,res) => {
  const options = {
    amount: 50000,
    currency: "INR",
    receipt: "secret-code",
    notes: {
      key1: "value3",
      key2: "value2"
    }
  };
  try {
    instance.orders.create(options, (err, order) => {
      if (!err) {
        return res.status(200).json({data: order});
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error); 
  }
});

router.route("/verify").post(async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", "VZc9JsrY0coqC1YbAEkOTgQi")
      .update(sign.toString())
      .digest("hex");
    if (expectedSign === razorpay_signature) {
      return res.status(200).json({ message: "succesful payment" });
    } else {
      return res.status(400).json({ message: "Invalid signature" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occured" });
  }
});

export default router;
