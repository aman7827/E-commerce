/**
 * apiFeatures.js
 * Purpose: Reusable query builder for MongoDB — filter, search, sort, paginate.
 * Used by productController and other list endpoints to keep controllers clean.
 *
 * Interview Q: Why extract query building into a separate class?
 * A: DRY principle — avoids repeating filter/sort/paginate logic in every controller.
 *    Also makes it easy to unit test and extend (e.g., add geo queries later).
 */

class APIFeatures {
  /**
   * @param {Object} query    - Mongoose query object (e.g. Product.find())
   * @param {Object} queryStr - req.query from Express (e.g. { keyword, category, sort, page })
   */
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  /**
   * search — Full-text search on name field using regex
   * Usage: ?keyword=laptop
   */
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", // case-insensitive
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this; // return this for method chaining
  }

  /**
   * filter — Filter by any field (category, brand, price range, rating)
   * Strips out special query params (keyword, sort, page, limit) first
   * Usage: ?category=electronics&price[gte]=500&price[lte]=2000
   */
  filter() {
    const queryObj = { ...this.queryStr };

    // Remove non-filter fields
    const excludedFields = ["keyword", "sort", "page", "limit"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Convert to MongoDB operators: gte → $gte, lte → $lte, etc.
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /**
   * sort — Sort results
   * Usage: ?sort=price (asc), ?sort=-price (desc), ?sort=-createdAt (newest)
   * Default: newest first (-createdAt)
   */
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); // Default: newest first
    }
    return this;
  }

  /**
   * paginate — Limit results and skip for pagination
   * Usage: ?page=2&limit=10
   * Default: page=1, limit=10
   */
  paginate(defaultLimit = 10) {
    const page = parseInt(this.queryStr.page) || 1;
    const limit = parseInt(this.queryStr.limit) || defaultLimit;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;
    return this;
  }
}

module.exports = APIFeatures;
