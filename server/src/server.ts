import app from "./app";
import config from "./config/config";
import connectDB from "./service/db";

app.listen(config.port, async () => {
  await connectDB();
  console.log(`Server running on port ${config.port}`);
});
