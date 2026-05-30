// ─────────────────────────────────────────────────────────────────────────────
//  catchAsync.js
//
//  A simple wrapper that removes the need to write try/catch in every
//  async controller. If the async function throws an error, it automatically
//  passes it to Express's error handler (globalErrorHandler).
//
//  Without catchAsync (lots of repetition):
//    router.get('/', async (req, res, next) => {
//      try {
//        const tours = await Tour.find();
//        res.json({ tours });
//      } catch (err) {
//        next(err);  // pass to error handler
//      }
//    });
//
//  With catchAsync (clean):
//    router.get('/', catchAsync(async (req, res) => {
//      const tours = await Tour.find();
//      res.json({ tours });
//    }));
// ─────────────────────────────────────────────────────────────────────────────

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next); // If fn throws, pass error to next()
};

module.exports = catchAsync;
