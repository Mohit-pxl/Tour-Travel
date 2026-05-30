/**
 * Sends a standardized, consistent JSON success response.
 *
 * @param {object}  res        - Express response object
 * @param {number}  statusCode - HTTP status code (default 200)
 * @param {string}  message    - Human-readable message
 * @param {*}       data       - Response payload
 * @param {object}  [meta]     - Optional metadata (pagination, etc.)
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, meta = {}) => {
  const response = {
    status: 'success',
    message,
    ...(data !== null && { data }),
    ...(Object.keys(meta).length && { meta }),
  };
  return res.status(statusCode).json(response);
};

/**
 * Builds a pagination metadata object from query params and total count.
 *
 * @param {number} page   - Current page number
 * @param {number} limit  - Items per page
 * @param {number} total  - Total documents count
 * @returns {{ page, limit, totalPages, totalResults, hasNext, hasPrev }}
 */
const paginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

module.exports = { sendSuccess, paginationMeta };
