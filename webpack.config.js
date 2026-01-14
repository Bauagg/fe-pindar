module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
};
