import './LoadEnv'; // Must be the first import
import { app } from '@server';
import { Logger } from '@core';

// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    Logger.info('Express server started on port: ' + port);
});
