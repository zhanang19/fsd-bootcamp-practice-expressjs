const {
  book: BookModel,
  order: OrderModel,
  order_detail: OrderDetailModel
} = require("../models");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const index = async (req, res, next) => {
  const orders = await OrderModel.findAll({
    where: {
      customer_id: req.user.id,
    },
    include: [
      {
        model: OrderDetailModel,
        as: "order_details",
        include: [
          {
            model: BookModel,
            attributes: ["title"],
            as: "book",
          },
        ],
      },
    ],
  });

  return res.send({
    message: "Success",
    data: orders.map((order) => ({
      id: order.id,
      order_date: order.order_date,
      shipping_address: order.shipping_address,
      total: parseFloat(order.total),
      created_at: order.created_at,
      items: order.order_details.map((detail) => ({
        book_id: detail.book_id,
        title: detail.book.title,
        quantity: detail.quantity,
        price: parseFloat(detail.price),
        subtotal: parseFloat(detail.subtotal),
      })),
    })),
  });
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const create = async (req, res, next) => {
  const { items } = req.body;
  const currentUser = req.user;

  const newOrder = await OrderModel.create({
    customer_id: currentUser.id,
    order_date: new Date(),
    shipping_address: currentUser.shipping_address,
  });

  const books = await BookModel.findAll({
    where: {
      id: items.map((item) => item.book_id),
    },
  });

  let totalPrice = 0;

  const orderDetails = items.map((item) => {
    const book = books.find((b) => b.id === item.book_id);

    const subtotal = book.price * item.quantity;
    totalPrice += subtotal;

    return {
      order_id: newOrder.id,
      book_id: item.book_id,
      quantity: item.quantity,
      price: book.price,
      subtotal: subtotal,
    };
  });

  await OrderDetailModel.bulkCreate(orderDetails);

  await OrderModel.update(
    {
      total: totalPrice,
    },
    {
      where: {
        id: newOrder.id,
      },
    }
  );

  return res.send({
    message: "Success",
    data: {
      order_id: newOrder.id,
      total: totalPrice,
      items: orderDetails.map((od) => ({
        book_id: od.book_id,
        quantity: od.quantity,
        price: parseFloat(od.price),
        subtotal: parseFloat(od.subtotal),
      })),
    },
  });
};

module.exports = { index, create };
