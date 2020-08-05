import { container } from "tsyringe";

import IStorageProvider from "./StorageProvider/models/IStorageProvider";
import DiskStorageProvider from "./StorageProvider/implementations/DiskStorageProvider";

// import IMailProvider from "./MailProvider/models/IMailProvider";
// import DiskStorageProvider from "./MailProvider/implementations/";

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  DiskStorageProvider
);
