import Course from '../models/courseModel.js';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { courseId, userId } = req.body;

    // Course check
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const options = {
      amount: course.price * 100, // paisa
      currency: 'INR',
      receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
    };

    const order = await razorpayInstance.orders.create(options);

    // Save order in DB
    await Order.create({
      course: courseId,
      student: userId,
      razorpay_order_id: order.id,
      amount: options.amount,
      currency: options.currency,
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Order creation failed ${err}` });
  }
};

// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      userId,
    } = req.body;

    // console.log('Verify Payment Body:', req.body);

    // Signature check
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    // console.log('Generated Signature:', generated_signature);
    // console.log('Received Signature:', razorpay_signature);

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Update order
    const order = await Order.findOne({ razorpay_order_id });
    if (order) {
      order.razorpay_payment_id = razorpay_payment_id;
      order.razorpay_signature = razorpay_signature;
      order.isPaid = true;
      order.paidAt = new Date();
      await order.save();
    }

    // Update user enrollment
    const user = await User.findById(userId);
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    // Update course enrollment
    const course = await Course.findById(courseId);
    if (!course.enrolledStudents.includes(userId)) {
      course.enrolledStudents.push(userId);
      await course.save();
    }

    return res.status(200).json({
      message: 'Payment verified and enrollment successful',
      order,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Payment verification failed', error });
  }
};

// import Course from '../models/courseModel.js';
// import User from '../models/userModel.js';
// import Order from '../models/orderModel.js';
// import razorpay from 'razorpay';
// import dotenv from 'dotenv';
// import crypto from 'crypto'; // ✅ crypto import kiya
// dotenv.config();

// const razorpayInstance = new razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// // CREATE ORDER
// export const createOrder = async (req, res) => {
//   try {
//     const { courseId, userId } = req.body; // ✅ Add userId here

//     const course = await Course.findById(courseId);
//     if (!course) return res.status(404).json({ message: 'Course not found' });

//     const options = {
//       amount: course.price * 100, // in paisa
//       currency: 'INR',
//       receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
//     };

//     const order = await razorpayInstance.orders.create(options);

//     // ✅ Save order in DB
//     await Order.create({
//       course: courseId,
//       student: userId,
//       razorpay_order_id: order.id,
//       amount: options.amount,
//       currency: options.currency,
//     });

//     return res.status(200).json({
//       success: true,
//       orderId: order.id,
//       amount: options.amount,
//       key: process.env.RAZORPAY_KEY_ID,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: `Order creation failed ${err}` });
//   }
// };

// // VERIFY PAYMENT
// export const verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       courseId,
//       userId,
//     } = req.body;

//     // ✅ Signature verification
//     const generated_signature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_SECRET)
//       .update(razorpay_order_id + '|' + razorpay_payment_id)
//       .digest('hex');

//     if (generated_signature !== razorpay_signature) {
//       return res.status(400).json({ message: 'Invalid signature' });
//     }

//     // ✅ Update order
//     const order = await Order.findOne({ razorpay_order_id });
//     if (order) {
//       order.razorpay_payment_id = razorpay_payment_id;
//       order.razorpay_signature = razorpay_signature;
//       order.isPaid = true;
//       order.paidAt = new Date();
//       await order.save();
//     }

//     // ✅ Update user enrollment
//     const user = await User.findById(userId);
//     if (!user.enrolledCourses.includes(courseId)) {
//       user.enrolledCourses.push(courseId);
//       await user.save();
//     }

//     // ✅ Update course enrollment
//     const course = await Course.findById(courseId);
//     if (!course.enrolledStudents.includes(userId)) {
//       course.enrolledStudents.push(userId);
//       await course.save();
//     }

//     return res.status(200).json({
//       message: 'Payment verified and enrollment successful',
//       order,
//     });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ message: 'Payment verification failed', error });
//   }
// };

// // import Course from '../models/courseModel.js';
// // import razorpay from 'razorpay';
// // import User from '../models/userModel.js';
// // import dotenv from 'dotenv';
// // import Order from '../models/orderModel.js';
// // dotenv.config();
// // const razorpayInstance = new razorpay({
// //   key_id: process.env.RAZORPAY_KEY_ID,
// //   key_secret: process.env.RAZORPAY_SECRET,
// // });

// // export const createOrder = async (req, res) => {
// //   try {
// //     const { courseId } = req.body;

// //     const course = await Course.findById(courseId);
// //     if (!course) return res.status(404).json({ message: 'Course not found' });

// //     const options = {
// //       amount: course.price * 100, // in paisa
// //       currency: 'INR',
// //       receipt: `${courseId}.toString()`,
// //     };

// //     const order = await razorpayInstance.orders.create(options);
// //     return res.status(200).json(order);
// //   } catch (err) {
// //     console.log(err);
// //     return res.status(500).json({ message: `Order creation failed ${err}` });
// //   }
// // };

// // export const verifyPayment = async (req, res) => {
// //   try {
// //     const { razorpay_order_id, courseId, userId } = req.body;
// //     const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
// //     if (orderInfo.status === 'paid') {
// //       // Update user and course enrollment
// //       const user = await User.findById(userId);
// //       if (!user.enrolledCourses.includes(courseId)) {
// //         user.enrolledCourses.push(courseId);
// //         await user.save();
// //       }

// //       const course = await Course.findById(courseId).populate('lectures');
// //       if (!course.enrolledStudents.includes(userId)) {
// //         course.enrolledStudents.push(userId);
// //         await course.save();
// //       }

// //       return res
// //         .status(200)
// //         .json({ message: 'Payment verified and enrollment successful' });
// //     } else {
// //       return res
// //         .status(400)
// //         .json({ message: 'Payment verification failed (invalid signature)' });
// //     }
// //   } catch (error) {
// //     console.log(error);
// //     return res
// //       .status(500)
// //       .json({ message: 'Internal server error during payment verification' });
// //   }
// // };
