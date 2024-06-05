const { book: BookModel } = require("../models");
const { Op } = require("sequelize");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const index = async (req, res, next) => {
  let { keyword, page, limit } = req.query;

  // Set default value for page and limit
  page = parseInt(page || 1);
  limit = parseInt(limit || 10);

  // Build query to get books
  const query = {
    attributes: {
      include: [
        [
          BookModel.sequelize.literal(
            `(SELECT SUM(quantity) FROM order_details WHERE order_details.book_id = book.id)`
          ),
          "sold",
        ],
      ],
    },
    include: [
      {
        association: "authors",
        attributes: ["name"],
        through: { attributes: [] },
      },
    ],
    offset: (page - 1) * limit,
    limit,
    order: [[BookModel.sequelize.literal("sold"), "DESC"]],
  };

  // Add where clause if keyword is provided
  if (keyword) {
    query.where = {
      title: {
        [Op.like]: `%${keyword}%`,
      },
    };
  }

  const books = await BookModel.findAll(query);

  return res.send({
    message: "Success",
    data: books.map((b) => {
      const authors = b.authors.map((author) => author.name).join(", ");

      return {
        id: b.id,
        isbn: b.isbn,
        title: b.title,
        price: parseFloat(b.price),
        sold: parseInt(b.get("sold") || 0),
        authors,
      };
    }),
  });
};

module.exports = { index };
